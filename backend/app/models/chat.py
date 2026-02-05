from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    theme: str = Field(..., min_length=1, max_length=500)
    num_topics: int = Field(10, ge=1, le=20)
    history: list[ChatMessage] = Field(default_factory=list)
