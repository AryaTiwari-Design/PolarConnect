import re
from collections import Counter

from .store import load_index

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
}


def tokenize(text):
    return [word for word in re.findall(r"[a-zA-Z]{3,}", text.lower()) if word not in STOPWORDS]


def retrieve(question, limit=4):
    query_terms = Counter(tokenize(question))
    if not query_terms:
        return []
    scored = []
    for chunk in load_index():
        terms = Counter(tokenize(chunk["text"]))
        score = sum(query_terms[word] * terms.get(word, 0) for word in query_terms)
        if score:
            scored.append((score, chunk))
    scored.sort(key=lambda item: item[0], reverse=True)
    return [chunk for _, chunk in scored[:limit]]
