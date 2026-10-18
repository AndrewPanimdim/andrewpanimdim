import json
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# ---------- 1. Create the app ----------
app = FastAPI(
    title="About Andrew Panimdim API",
    description="A tiny API that returns information about Andrew Panimdim.",
    version="1.0.0",
)

# ---------- 2. Allow browsers on other domains to call this ----------
# "*" = anyone. Fine for public, read-only data. Later, replace with your
# website's address, e.g. ["https://yourname.vercel.app"].
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET"],
)

# ---------- 3. Load the data once, when the server starts ----------
DATA = json.loads((Path(__file__).parent / "me.JSON").read_text(encoding="utf-8"))


# ---------- 4. Routes ----------
@app.get("/")
def root():
    """Index: tells visitors what routes exist."""
    return {
        "message": "Hi! This is my About Me API.",
        "docs": "/docs",
        "routes": ["/me", "/skills", "/projects", "/projects/{id}", "/socials", "/facts"],
    }


@app.get("/me")
def me():
    return DATA["profile"]


@app.get("/skills")
def skills(category: str | None = None, level: str | None = None):
    """Query params: /skills?category=frontend&level=beginner"""
    results = DATA["skills"]
    if category:
        results = [s for s in results if s["category"].lower() == category.lower()]
    if level:
        results = [s for s in results if s["level"].lower() == level.lower()]
    return results


@app.get("/projects")
def projects(tag: str | None = None):
    """Query param: /projects?tag=web"""
    results = DATA["projects"]
    if tag:
        results = [p for p in results if tag.lower() in p["tags"]]
    return results


@app.get("/projects/{project_id}")
def project(project_id: int):
    """Path param: /projects/2"""
    for p in DATA["projects"]:
        if p["id"] == project_id:
            return p
    raise HTTPException(status_code=404, detail=f"No project with id {project_id}")

@app.get("/socials")
def socials():
    return DATA["socials"]


@app.get("/facts")
def facts():
    return DATA["facts"]