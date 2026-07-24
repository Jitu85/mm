"""OOXML extraction pipeline per spec Sections 1-7.
Usage: python extract_docx.py
Extracts all 3 volumes from the Box folder into extracted_data/"""

import zipfile, json, re, sys
from pathlib import Path
from lxml import etree

NS = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}
INSTRUCTION_VERBS = {"Rewrite","Join","Combine","Fill in","Complete","Correct",
    "Identify","Punctuate","Convert","Change","Form","Choose","Select","Match",
    "Pick","Underline","Insert"}

def html_escape(t): return t.replace("&","&amp;").replace("<","&lt;").replace(">","&gt;")

def extract_run(run):
    texts = [t.text or "" for t in run.iterfind(".//w:t",NS)]
    if not texts and run.find(".//w:tab",NS) is not None: texts = ["\t"]
    plain = "".join(texts)
    rpr = run.find("w:rPr",NS)
    has_bold = rpr is not None and rpr.find("w:b",NS) is not None
    has_i = rpr is not None and rpr.find("w:i",NS) is not None
    has_u = rpr is not None and rpr.find("w:u",NS) is not None
    has_red = False
    if rpr is not None:
        c = rpr.find("w:color",NS)
        if c is not None and c.get(f"{{{NS['w']}}}val","").upper()=="FF0000": has_red = True
    h = html_escape(plain)
    if has_red: h = f'<span class="hl-red">{h}</span>'
    if has_bold: h = f"<strong>{h}</strong>"
    if has_i: h = f"<em>{h}</em>"
    if has_u: h = f"<u>{h}</u>"
    return plain, h

def extract_para(p):
    is_list = p.find(".//w:numPr",NS) is not None
    pp, hp = [], []
    for r in p.iterfind("w:r",NS):
        pk, hk = extract_run(r); pp.append(pk); hp.append(hk)
    for hl in p.iterfind("w:hyperlink",NS):
        for r in hl.iterfind("w:r",NS):
            pk, hk = extract_run(r); pp.append(pk); hp.append(hk)
    return {"type":"p","plain":"".join(pp).strip(),"html":"".join(hp),"is_list":is_list}

def extract_table(t):
    rows = []
    for row in t.iterfind(".//w:tr",NS):
        cells = []
        for cell in row.iterfind("w:tc",NS):
            paras = [extract_para(p)["html"] or extract_para(p)["plain"] for p in cell.iterfind("w:p",NS)]
            cells.append("<br>".join(paras))
        rows.append(cells)
    return {"type":"table","rows":rows}

def extract_docx(path):
    items = []
    with zipfile.ZipFile(path,"r") as z:
        root = etree.fromstring(z.read("word/document.xml"))
        body = root.find("w:body",NS)
        for child in body.iterchildren():
            tag = etree.QName(child).localname
            if tag == "p": items.append(extract_para(child))
            elif tag == "tbl": items.append(extract_table(child))
    return items

def detect_chapters(items):
    chs = []
    for i,item in enumerate(items):
        if item["type"]=="table" and item["rows"]:
            r = item["rows"][0]
            if len(r)>=2:
                m = re.search(r"(\d+)",r[0])
                if m:
                    n = int(m.group(1))
                    if 1<=n<=200:
                        chs.append({"number":n,"title":re.sub(r"<[^>]+>","",r[1]).strip(),"index":i})
    return chs

def split_chapters(items, chs):
    out = []
    for i,ch in enumerate(chs):
        end = chs[i+1]["index"] if i+1<len(chs) else len(items)
        out.append({"number":ch["number"],"title":ch["title"],"items":items[ch["index"]+1:end]})
    return out

def should_drop(item):
    t = item["plain"].strip()
    if not t: return True
    if re.match(r"^[_\s]{4,}$",t): return True
    if "space provided" in t.lower(): return True
    if "kindle" in t.lower() and "digital" in t.lower(): return True
    if "end of part" in t.lower(): return True
    return False

def parse_exercises(items):
    body, exercises = [], []
    ans_start = -1
    for i,it in enumerate(items):
        if it["type"]=="p" and it["plain"].strip().lower()=="answers": ans_start=i; break
    ex_markers = []
    for i,it in enumerate(items):
        if ans_start!=-1 and i>=ans_start: break
        if it["type"]=="p" and re.match(r"^EXERCISE\s*\d",it["plain"],re.IGNORECASE): ex_markers.append(i)
    body_end = ex_markers[0] if ex_markers else (ans_start if ans_start!=-1 else len(items))
    for it in items[:body_end]:
        if it["type"]=="p" and not should_drop(it): body.append(it)
    for ei, es in enumerate(ex_markers):
        ee = ex_markers[ei+1] if ei+1<len(ex_markers) else (ans_start if ans_start!=-1 else len(items))
        ex_items = items[es:ee]
        parsed = parse_one_exercise(ex_items)
        if parsed: exercises.append(parsed)
    answers = {}
    if ans_start!=-1: answers = parse_answer_key(items[ans_start+1:])
    return {"body":body,"exercises":exercises,"answers":answers}

def parse_one_exercise(items):
    if not items: return None
    marker = items[0] if items[0]["type"]=="p" else None
    ex_num = 0
    if marker:
        m = re.search(r"EXERCISE\s*(\d+)",marker["plain"],re.IGNORECASE)
        if m: ex_num = int(m.group(1))
    instruction, cur, subs = "", [], []
    for it in items[1:]:
        if it["type"]!="p": continue
        t = it["plain"].strip()
        if not t: continue
        if it["is_list"]:
            fw = t.split()[0] if t.split() else ""
            if fw in INSTRUCTION_VERBS and len(t)<110 and not t.startswith("="):
                if cur: subs.append({"instruction":instruction,"items":cur})
                instruction = t; cur = []
            else:
                cur.append({"id":f"ex{ex_num}-i{len(cur)+1}","text":t,"answer":None})
        else:
            if cur: subs.append({"instruction":instruction,"items":cur}); cur = []
            instruction = t
    if cur: subs.append({"instruction":instruction,"items":cur})
    if not subs: return None
    return {"id":f"ex{ex_num}","exercise_number":ex_num,"subgroups":subs}

def parse_answer_key(items):
    ans = {}; cur_ex = None; cur_a = []
    for it in items:
        if it["type"]!="p": continue
        t = it["plain"].strip()
        if not t: continue
        m = re.match(r"^Exercise\s*(\d+)",t,re.IGNORECASE)
        if m:
            if cur_ex is not None: ans[cur_ex] = cur_a
            cur_ex = int(m.group(1)); cur_a = []
            rest = t[m.end():].strip()
            if rest:
                for p in re.split(r"\d+\.\s*",rest):
                    if p.strip(): cur_a.append(p.strip())
            continue
        if cur_ex is not None:
            for p in re.split(r"\d+\.\s*",t):
                if p.strip(): cur_a.append(p.strip())
    if cur_ex is not None: ans[cur_ex] = cur_a
    return ans

def main():
    src = Path(r"C:\Users\HP\Box\KDP\My Publishes\Grammar")
    out = Path(__file__).parent/"extracted_data"; out.mkdir(exist_ok=True)
    for f in sorted(src.glob("Modern English Grammar - *.docx")):
        print(f"Extracting {f.name}...")
        items = extract_docx(str(f))
        chs = detect_chapters(items)
        if not chs:
            print(f"  WARNING: no chapters in {f.name}"); continue
        vols = split_chapters(items, chs)
        data = []
        for ch in vols:
            p = parse_exercises(ch["items"])
            data.append({"number":ch["number"],"title":ch["title"],"body":p["body"],"exercises":p["exercises"],"answers":p["answers"]})
        fp = out/f"{f.stem}.json"
        fp.write_text(json.dumps(data,indent=2,ensure_ascii=False),encoding="utf-8")
        print(f"  >> {len(data)} chapters -> {fp.name}")
    print("\nDone. Run python extraction_report.py to verify.")

if __name__=="__main__": main()
