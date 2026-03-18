import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse

from app.routers import projects, skills, experience, about, contact, auth

# Resolve static files directory: env var → frontend/dist/ at repo root
STATIC_DIR = Path(
    os.getenv("STATIC_DIR", str(Path(__file__).parent.parent.parent / "frontend" / "dist"))
)

app = FastAPI(
    title="Portfolio API",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_PREFIX = "/api/v1"
app.include_router(auth.router, prefix=API_PREFIX)
app.include_router(projects.router, prefix=API_PREFIX)
app.include_router(skills.router, prefix=API_PREFIX)
app.include_router(experience.router, prefix=API_PREFIX)
app.include_router(about.router, prefix=API_PREFIX)
app.include_router(contact.router, prefix=API_PREFIX)


@app.get("/{full_path:path}", include_in_schema=False)
async def serve_spa(full_path: str = ""):
    index_path = STATIC_DIR / "index.html"

    if not index_path.is_file():
        return JSONResponse(
            {"message": "Portfolio API is running. Frontend not built yet."},
            status_code=200,
        )

    # Serve real files (JS, CSS, images, etc.) directly
    candidate = STATIC_DIR / full_path
    if full_path and candidate.is_file():
        return FileResponse(str(candidate))

    # All other paths → SPA entry point
    return FileResponse(str(index_path))
