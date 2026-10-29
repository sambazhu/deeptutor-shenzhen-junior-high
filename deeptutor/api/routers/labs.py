from pathlib import Path
from fastapi import APIRouter, HTTPException
from fastapi.responses import HTMLResponse

router = APIRouter()

CACHE_DIRS = [
    Path.home() / ".deeptutor" / "labs_cache",
    Path("/Users/sambazhu/dshworkplace/DeepTutor/labs_cache"),
    Path("/Users/sambazhu/dshworkplace/朱秋宇初一学习台账/00_教材与参考书/00_3D实验室课件"),
]

@router.get("/{slug}", response_class=HTMLResponse)
async def get_lab_course(slug: str):
    clean_slug = slug.removesuffix(".html")
    for cache_dir in CACHE_DIRS:
        html_file = cache_dir / f"{clean_slug}.html"
        if html_file.is_file():
            content = html_file.read_text(encoding="utf-8")
            return HTMLResponse(
                content=content,
                headers={
                    "Content-Type": "text/html; charset=utf-8",
                    "Cache-Control": "public, max-age=86400",
                },
            )
    raise HTTPException(status_code=404, detail="Lab course not found")
