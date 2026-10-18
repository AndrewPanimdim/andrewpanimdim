import json
from pathlib import Path

from fastapi import APIRouter, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

DATA = json.loads((Path(__file__).parent / "me.JSON").read_text(encoding="utf-8"))

app = FastAPI(
    title="About Andrew Panimdim API",
    description="A tiny API that returns information about Andrew Panimdim.",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "HEAD", "OPTIONS"],
    allow_headers=["*"],
)

router = APIRouter(prefix="/api")


@router.get("")
@router.get("/")
def root():
    return {
        "message": "Hi! This is my About Me API.",
        "docs": "/api/docs",
        "routes": [
            "/api/me",
            "/api/skills",
            "/api/projects",
            "/api/projects/{id}",
            "/api/socials",
            "/api/facts",
        ],
    }


@router.get("/me")
def me():
    return DATA["profile"]


@router.get("/skills")
def skills(category: str | None = None, level: str | None = None):
    results = DATA["skills"]
    if category:
        results = [s for s in results if s["category"].lower() == category.lower()]
    if level:
        results = [s for s in results if s["level"].lower() == level.lower()]
    return results


@router.get("/projects")
def projects(tag: str | None = None):
    results = DATA["projects"]
    if tag:
        results = [p for p in results if tag.lower() in p["tags"]]
    return results


@router.get("/projects/{project_id}")
def project(project_id: int):
    for p in DATA["projects"]:
        if p["id"] == project_id:
            return p
    raise HTTPException(status_code=404, detail=f"No project with id {project_id}")


@router.get("/socials")
def socials():
    return DATA["socials"]


@router.get("/facts")
def facts():
    return DATA["facts"]


app.include_router(router)
