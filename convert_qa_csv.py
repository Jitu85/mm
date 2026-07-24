import csv
import json
import os

csv_path = r"c:\Users\HP\Documents\GitHub\Digitally Virtual\Codex_Version\Q&A.csv"
output_dir = r"c:\Users\HP\Documents\GitHub\Digitally Virtual\vc-app\src\data"
output_file = os.path.join(output_dir, "qa_data.json")

os.makedirs(output_dir, exist_ok=True)

questions = []

with open(csv_path, mode="r", encoding="utf-8-sig") as f:
    reader = csv.DictReader(f)
    for idx, row in enumerate(reader, start=1):
        q_text = row.get("Questions", "").strip()
        op1 = row.get("Option_1", "").strip()
        op2 = row.get("Option_2", "").strip()
        op3 = row.get("Option_3", "").strip()
        op4 = row.get("Option_4", "").strip()
        answer = row.get("Answer", "").strip()
        explanation = row.get("Explaination", "").strip()
        subject = row.get("Subject", "").strip()
        series = row.get("Series", "").strip()

        if not q_text:
            continue

        options = [op for op in [op1, op2, op3, op4] if op]

        questions.append({
            "id": f"qa_{idx}",
            "question": q_text,
            "options": options,
            "answer": answer,
            "explanation": explanation,
            "subject": subject,
            "series": series
        })

with open(output_file, mode="w", encoding="utf-8") as f:
    json.dump(questions, f, indent=2, ensure_ascii=False)

print(f"Successfully converted {len(questions)} questions to {output_file}")
