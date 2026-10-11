from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[2]
AI_DIR = Path(__file__).resolve().parents[1]
DEFAULT_INDEX_PATH = AI_DIR / "rag_index.json"
DEFAULT_CHROMA_PATH = AI_DIR / "vector_store" / "chroma"
DEFAULT_APPROVED_DOCS_DIR = ROOT_DIR / "research_docs" / "approved"

DEFAULT_CHUNK_SIZE = 1000
DEFAULT_CHUNK_OVERLAP = 200
DEFAULT_RETRIEVAL_LIMIT = 5
DEFAULT_EMBEDDING_MODEL = "all-MiniLM-L6-v2"
CHROMA_COLLECTION_NAME = "polarconnect_approved_research"
