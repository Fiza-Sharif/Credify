import re

with open('temp_stitch_credify_ai_loan_predictor (2)/code.html', 'r', encoding='utf-8') as f:
    html = f.read()

m = re.search(r'id="tailwind-config">(.*?)</script>', html, re.DOTALL)
if m:
    print("=== TAILWIND CONFIG ===")
    print(m.group(1).strip())

with open('temp_stitch_credify_ai_loan_predictor (2)/DESIGN.md', 'r', encoding='utf-8') as f:
    design_text = f.read()
    print("\n=== DESIGN.md ===")
    print(design_text[:2000])
