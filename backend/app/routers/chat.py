import json

from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from app.models.chat import ChatRequest
from app.services.chat_service import stream_table_topics

router = APIRouter(tags=["chat"])


@router.post("/stream")
async def chat_stream(request: ChatRequest):
    async def generate():
        async for token in stream_table_topics(
            theme=request.theme,
            num_topics=request.num_topics,
            history=[m.model_dump() for m in request.history],
        ):
            yield f"data: {json.dumps({'content': token})}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
