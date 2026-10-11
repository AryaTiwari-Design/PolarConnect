from pydantic import BaseModel, Field


class IngestRequest(BaseModel):
    paper_id: int | str
    title: str
    file_path: str


class ChatRequest(BaseModel):
    question: str = Field(min_length=2)
    limit: int = Field(default=5, ge=1, le=10)


class Source(BaseModel):
    paper_id: str
    title: str
    page: int


class ChatResponse(BaseModel):
    answer: str
    sources: list[Source]


class DocumentSummary(BaseModel):
    paper_id: str
    title: str
    chunks: int
    pages: list[int]
