from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.database import Base, engine
from app.routers import auth, animals, reports, cases, clusters

Base.metadata.create_all(bind=engine)

app = FastAPI(title="SIH26128 — Livestock Health Early-Warning API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(animals.router)
app.include_router(reports.router)
app.include_router(cases.router)
app.include_router(clusters.router)


@app.get("/health")
def health():
    return {"status": "ok"}