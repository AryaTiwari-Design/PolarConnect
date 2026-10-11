import re
from collections import Counter
from math import log

from .store import load_index
from .vector_store import VectorStoreUnavailable, query_vectors

STOPWORDS = {
    "a",
    "an",
    "and",
    "are",
    "as",
    "for",
    "from",
    "in",
    "is",
    "of",
    "on",
    "or",
    "the",
    "to",
    "what",
    "why",
    "how",
    "does",
    "tell",
    "explain",
    "using",
    "student",
}


def tokenize(text: str) -> list[str]:
    return [word for word in re.findall(r"[a-zA-Z]{3,}", text.lower()) if word not in STOPWORDS]


def retrieve(question: str, limit: int = 5) -> list[dict]:
    try:
        vector_chunks = query_vectors(question, limit=limit)
        if vector_chunks:
            return vector_chunks
    except VectorStoreUnavailable:
        pass

    index = load_index()
    query_terms = Counter(tokenize(question))
    if not query_terms or not index:
        return []

    doc_frequency = Counter()
    tokenized_chunks = []
    for chunk in index:
        terms = Counter(tokenize(f"{chunk['title']} {chunk['text']}"))
        tokenized_chunks.append((chunk, terms))
        for term in terms:
            doc_frequency[term] += 1

    total_chunks = len(index)
    scored = []
    for chunk, terms in tokenized_chunks:
        score = 0.0
        length_penalty = max(sum(terms.values()), 1)
        for word, query_count in query_terms.items():
            if word not in terms:
                continue
            idf = log((1 + total_chunks) / (1 + doc_frequency[word])) + 1
            score += query_count * terms[word] * idf
        score = score / (length_penalty ** 0.25)
        if any(word in chunk["title"].lower() for word in query_terms):
            score *= 1.25
        if score:
            scored.append((score, chunk))
    scored.sort(key=lambda item: item[0], reverse=True)
    return [chunk for _, chunk in scored[:limit]]
