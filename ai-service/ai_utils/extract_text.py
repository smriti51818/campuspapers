import fitz
from typing import Optional
import httpx
import io

def extract_pdf_text_from_url(url: str) -> str:
    r = httpx.get(url, timeout=30)
    r.raise_for_status()
    return extract_pdf_text_bytes(r.content)

def extract_pdf_text_bytes(data: bytes) -> str:
    text = []
    with fitz.open(stream=io.BytesIO(data), filetype="pdf") as doc:
        for page in doc:
            text.append(page.get_text())
    return "\n".join(text)
