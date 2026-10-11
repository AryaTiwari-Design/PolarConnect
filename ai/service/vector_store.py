from __future__ import annotations

import importlib.util
from functools import lru_cache

from .config import CHROMA_COLLECTION_NAME, DEFAULT_CHROMA_PATH, DEFAULT_EMBEDDING_MODEL


class VectorStoreUnavailable(RuntimeError):
    pass


def is_vector_store_available() -> bool:
    return importlib.util.find_spec("chromadb") is not None and importlib.util.find_spec("sentence_transformers") is not None


def has_vector_index() -> bool:
    return DEFAULT_CHROMA_PATH.exists() and any(DEFAULT_CHROMA_PATH.iterdir())


@lru_cache(maxsize=1)
def _embedding_model():
    try:
        from sentence_transformers import SentenceTransformer
    except Exception as exc:
        raise VectorStoreUnavailable("sentence-transformers is not installed") from exc
    try:
        return SentenceTransformer(DEFAULT_EMBEDDING_MODEL)
    except Exception as exc:
        raise VectorStoreUnavailable(
            f"Embedding model '{DEFAULT_EMBEDDING_MODEL}' is not available yet"
        ) from exc


@lru_cache(maxsize=1)
def _collection():
    try:
        import chromadb
    except Exception as exc:
        raise VectorStoreUnavailable("chromadb is not installed") from exc

    try:
        DEFAULT_CHROMA_PATH.mkdir(parents=True, exist_ok=True)
        client = chromadb.PersistentClient(path=str(DEFAULT_CHROMA_PATH))
        return client.get_or_create_collection(
            name=CHROMA_COLLECTION_NAME,
            metadata={"description": "Approved PolarConnect research PDF chunks"},
        )
    except Exception as exc:
        raise VectorStoreUnavailable("ChromaDB could not be opened") from exc


def _embed(texts: list[str]) -> list[list[float]]:
    if not texts:
        return []
    try:
        vectors = _embedding_model().encode(texts, normalize_embeddings=True)
        return [vector.tolist() for vector in vectors]
    except VectorStoreUnavailable:
        raise
    except Exception as exc:
        raise VectorStoreUnavailable("Embedding generation failed") from exc


def upsert_vectors(chunks: list[dict]) -> int:
    if not chunks:
        return 0

    collection = _collection()
    ids = [chunk["chunk_id"] for chunk in chunks]
    texts = [chunk["text"] for chunk in chunks]
    embeddings = _embed(texts)
    metadatas = [
        {
            "paper_id": str(chunk["paper_id"]),
            "title": chunk["title"],
            "page": int(chunk["page"]),
        }
        for chunk in chunks
    ]
    collection.upsert(ids=ids, documents=texts, embeddings=embeddings, metadatas=metadatas)
    return len(chunks)


def delete_vectors_for_paper(paper_id: str) -> int:
    collection = _collection()
    existing = collection.get(where={"paper_id": str(paper_id)})
    ids = existing.get("ids", [])
    if ids:
        collection.delete(ids=ids)
    return len(ids)


def count_vectors() -> int:
    return _collection().count()


def rebuild_vectors(chunks: list[dict]) -> int:
    collection = _collection()
    existing = collection.get()
    ids = existing.get("ids", [])
    if ids:
        collection.delete(ids=ids)
    return upsert_vectors(chunks)


def query_vectors(question: str, limit: int = 5) -> list[dict]:
    collection = _collection()
    query_embedding = _embed([question])[0]
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=limit,
        include=["documents", "metadatas", "distances"],
    )

    chunks = []
    ids = results.get("ids", [[]])[0]
    documents = results.get("documents", [[]])[0]
    metadatas = results.get("metadatas", [[]])[0]
    distances = results.get("distances", [[]])[0]

    for chunk_id, text, metadata, distance in zip(ids, documents, metadatas, distances):
        chunks.append(
            {
                "chunk_id": chunk_id,
                "paper_id": str(metadata["paper_id"]),
                "title": metadata["title"],
                "page": int(metadata["page"]),
                "text": text,
                "score": 1 - float(distance),
                "retrieval": "chroma",
            }
        )
    return chunks
