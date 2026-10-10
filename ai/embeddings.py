from functools import lru_cache

DEFAULT_EMBEDDING_MODEL = "all-MiniLM-L6-v2"


class EmbeddingUnavailable(RuntimeError):
    pass


@lru_cache(maxsize=1)
def _load_model():
    try:
        from sentence_transformers import SentenceTransformer
    except Exception as exc:
        raise EmbeddingUnavailable("sentence-transformers is not installed") from exc
    try:
        return SentenceTransformer(DEFAULT_EMBEDDING_MODEL)
    except Exception as exc:
        raise EmbeddingUnavailable(f"Embedding model '{DEFAULT_EMBEDDING_MODEL}' is not available yet") from exc


def create_embeddings(texts):
    """
    Convert a list of text chunks into numerical vectors.
    """
    return _load_model().encode(texts, normalize_embeddings=True)
