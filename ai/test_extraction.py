from extraction import extract_text_from_pdf


pdf_path = "../research_docs/approved/Antarctic_Factsheet.pdf"

pages = extract_text_from_pdf(pdf_path)

print("Total pages:", len(pages))

for page in pages[:3]:
    print("\n" + "=" * 60)
    print("PAGE:", page["page"])
    print(page["text"][:1000])