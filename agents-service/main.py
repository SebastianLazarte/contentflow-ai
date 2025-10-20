import os
from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel, field_validator
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

AGENTS_KEY = os.getenv("AGENTS_KEY", "")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE = os.getenv("SUPABASE_SERVICE_ROLE")

if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE:
    raise RuntimeError("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE in .env")

sb: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE)

app = FastAPI()

class RunBody(BaseModel):
    prd_id: str

@app.get("/health")
def health():
    return {"ok": True}
class RunBody(BaseModel):
    prd_id: str

    @field_validator("prd_id")
    @classmethod
    def validate_uuid(cls, v: str) -> str:
        try:
            UUID(v)
        except Exception:
            raise ValueError("prd_id must be a valid UUID")
        return v
@app.post("/run")
def run_pipeline(body: RunBody, x_api_key: str = Header(default="")):
    if x_api_key != AGENTS_KEY:
        raise HTTPException(status_code=401, detail="bad key")

    # 1) (opcional) comprobar que el PRD existe
    prd = sb.table("prd").select("*").eq("id", body.prd_id).execute()
    if not prd.data:
        raise HTTPException(status_code=404, detail="prd_not_found")

    # 2) insertar primera etapa (mock ‘research’)
    research_text = (
        "Mock research notes:\n"
        "- Goal clarified\n- 3 key features noted\n- KPIs listed\n"
        "(Este es un stub: aquí luego irá LangGraph/RAG)."
    )
    ins = sb.table("content_version").insert({
        "prd_id": body.prd_id,
        "stage": "research",
        "content": research_text
    }).execute()

    return {"ok": True, "run_id": "stub-run", "inserted": ins.data}
