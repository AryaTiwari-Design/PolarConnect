from pydantic import BaseModel, Field


class RegisterIn(BaseModel):
    name: str = Field(min_length=2)
    email: str
    password: str = Field(min_length=6)
    role: str = "student"


class LoginIn(BaseModel):
    email: str
    password: str


class ResearchIn(BaseModel):
    title: str
    abstract: str = ""
    topic: str
    station: str | None = None
    year: int | None = None
    file_path: str | None = None


class ChatIn(BaseModel):
    question: str = Field(min_length=2)


class QuizSubmission(BaseModel):
    answers: list[int]
