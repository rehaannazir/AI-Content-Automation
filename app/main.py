from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import app.logger  # noqa: F401 — initializes rotating file handler and console logging
from app.database import create_table
from exceptions.handlers import register_exception_handlers
from middleware.logging_middleware import logging_middleware
from routers import auth, file, generate, history, user


@asynccontextmanager
async def lifespan(_: FastAPI):
    create_table()
    yield


app = FastAPI(
    title="AI Content Automation",
    description="REST API for AI-powered content generation: summaries, titles, keywords, and social posts.",
    version="1.0.0",
    lifespan=lifespan,
)

register_exception_handlers(app)
app.middleware("http")(logging_middleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(user.router)
app.include_router(file.router)
app.include_router(generate.router)
app.include_router(history.router)


@app.get("/", tags=["Health"])
def health_check():
    return {"status": "ok", "service": "AI Content Automation"}