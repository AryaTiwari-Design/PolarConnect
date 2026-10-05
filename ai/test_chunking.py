from extraction import extract_text_from_pdf
from chunking import chunk_pages


pdf_path = "../research_docs/approved/Antarctic_Factsheet.pdf"

# Step 1: Extract PDF
pages = extract_text_from_pdf(pdf_path)

print("Total pages:", len(pages))


# Step 2: Create chunks
chunks = chunk_pages(pages)

print("Total chunks:", len(chunks))


# Step 3: Display first 5 chunks
for i, chunk in enumerate(chunks[:5]):

    print("\n" + "=" * 60)

    print("CHUNK:", i + 1)
    print("PAGE:", chunk["page"])

    print("\nTEXT:")
    print(chunk["text"])