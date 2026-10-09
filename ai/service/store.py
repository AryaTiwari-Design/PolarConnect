import json
from pathlib import Path

INDEX_PATH = Path(__file__).resolve().parents[1] / "rag_index.json"


def load_index():
    if not INDEX_PATH.exists():
        return []
    return json.loads(INDEX_PATH.read_text(encoding="utf-8"))


def save_index(chunks):
    INDEX_PATH.write_text(json.dumps(chunks, indent=2), encoding="utf-8")


def upsert_paper_chunks(paper_id, title, chunks):
    index = [chunk for chunk in load_index() if str(chunk["paper_id"]) != str(paper_id)]
    for position, chunk in enumerate(chunks):
        index.append(
            {
                "paper_id": str(paper_id),
                "title": title,
                "page": chunk["page"],
                "chunk_id": f"{paper_id}-{position}",
                "text": chunk["text"],
            }
        )
    save_index(index)
    return len(chunks)


def delete_paper(paper_id):
    before = load_index()
    after = [chunk for chunk in before if str(chunk["paper_id"]) != str(paper_id)]
    save_index(after)
    return len(before) - len(after)
