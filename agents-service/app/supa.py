"""Supabase client helpers for the agents service."""

from functools import lru_cache
import os
from typing import Final

from dotenv import load_dotenv
from supabase import Client, create_client

load_dotenv()

SUPABASE_URL_ENV: Final[str] = "SUPABASE_URL"
SUPABASE_SERVICE_ROLE_ENV: Final[str] = "SUPABASE_SERVICE_ROLE"


@lru_cache(maxsize=1)
def _create_client() -> Client:
    """Create and cache the Supabase client used across the service."""
    url = os.getenv(SUPABASE_URL_ENV, "")
    key = os.getenv(SUPABASE_SERVICE_ROLE_ENV, "")
    if not url or not key:
        raise RuntimeError("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE in environment")
    return create_client(url, key)


def get_sb() -> Client:
    """Return a shared Supabase client instance."""
    return _create_client()
