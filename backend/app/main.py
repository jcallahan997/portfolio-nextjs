from contextlib import asynccontextmanager

import pandas as pd
import pyarrow.csv as pv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import clustering, chat, health


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load crash data into memory once at startup."""
    import os

    data_path = os.path.join(os.path.dirname(__file__), "data", "crash_data_prepped.csv")
    table = pv.read_csv(data_path)
    app.state.crash_data = table.to_pandas()
    yield


app = FastAPI(title="Callahan Portfolio API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api")
app.include_router(clustering.router, prefix="/api/clustering")
app.include_router(chat.router, prefix="/api/chat")
