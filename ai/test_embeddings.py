from extraction import extract_text_from_pdf
from chunking import chunk_pages
from embeddings import create_embeddings


pdf_path = "../research_docs/approved/Antarctic_Factsheet.pdf"


# Step 1: Extract PDF
pages = extract_text_from_pdf(pdf_path)

print("Pages:", len(pages))


# Step 2: Create chunks
chunks = chunk_pages(pages)

print("Chunks:", len(chunks))


# Step 3: Get text from chunks
texts = [chunk["text"] for chunk in chunks]


# Step 4: Create embeddings
embeddings = create_embeddings(texts)


print("Embeddings created!")
print("Number of embeddings:", len(embeddings))
print("Vector dimensions:", len(embeddings[0]))


# Show first vector
print("\nFirst embedding:")
print(embeddings[0])