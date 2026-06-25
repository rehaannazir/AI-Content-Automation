from fastapi import FastAPI

from app.database import create_table
from exceptions.handlers import register_exception_handlers
from middleware.logging_middleware import logging_middleware
from routers import auth, file, generate, history, user

app = FastAPI(
    title="AI Content Automation",
    version="1.0.0",
)

create_table()
register_exception_handlers(app)
app.middleware("http")(logging_middleware)

app.include_router(auth.router)
app.include_router(user.router)
app.include_router(file.router)
app.include_router(generate.router)
app.include_router(history.router)