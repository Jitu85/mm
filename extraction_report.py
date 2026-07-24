"""Print per-chapter exercise/item/answer counts for verification."""
import json, sys
from pathlib import Path
d = Path(__file__).parent/"extracted_data"
for jf in sorted(d.glob("*.json")):
    print(f"\n{'='*60}\n  {jf.stem}\n{'='*60}")
    for ch in json.loads(jf.read_text(encoding="utf-8")):
        print(f"\n  Ch{ch['number']}: {ch['title'][:60]}")
        ans = ch.get("answers",{})
        for ex in ch.get("exercises",[]):
            n = ex.get("exercise_number",0)
            items = sum(len(sg["items"]) for sg in ex.get("subgroups",[]))
            ac = len(ans.get(str(n),[]))
            ok = "OK" if items==ac else f"MISMATCH ({items} items, {ac} answers)"
            print(f"    ex{n}: {items} items, {ac} answers [{ok}]")
