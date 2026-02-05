from collections.abc import AsyncGenerator

import anthropic

from app.config import settings

SYSTEM_PROMPT = """You are a Toastmasters Table Topics question generator. Table Topics is an \
impromptu speaking exercise where members are given a question and must speak for 1-2 minutes \
without preparation. Generate exactly {n} creative, thought-provoking Table Topics questions \
based on the user's theme. The questions should be open-ended, engaging, and suitable for a \
diverse group of Toastmasters members. Number each question. Do not include any preamble or \
closing remarks -- just the numbered questions."""


async def stream_table_topics(
    theme: str,
    num_topics: int,
    history: list[dict],
) -> AsyncGenerator[str, None]:
    """Stream Table Topics questions from Anthropic Claude."""
    client = anthropic.Anthropic(api_key=settings.anthropic_api_key)

    system = SYSTEM_PROMPT.format(n=num_topics)

    # Build messages: include history, then the new user request
    messages = []
    for msg in history:
        messages.append({"role": msg["role"], "content": msg["content"]})

    user_message = f"Generate {num_topics} Table Topics questions about: {theme}"
    messages.append({"role": "user", "content": user_message})

    with client.messages.stream(
        model="claude-sonnet-4-20250514",
        max_tokens=2048,
        system=system,
        messages=messages,
    ) as stream:
        for text in stream.text_stream:
            yield text
