# Backend Notes

Active backend app `backend/main.py` hai.

Vercel deployment me actual entrypoint root par `api/index.py` hoga, jo isi FastAPI app ko expose karega.

## Important deployment behavior

- Mock interview ab server memory sessions par depend nahi karta.
- Har chat request conversation history ke saath aati hai, isliye Vercel Functions scaling ke baad bhi chatbot consistent rahega.
- Resume analyzer PDF ko memory me parse karta hai, temp-file based runtime dependency nahi rakhta.

## Required env vars

- `GROQ_API_KEY`

## Optional env vars

- `GROQ_MODEL`
- `GROQ_TEMPERATURE`
- `GROQ_MAX_TOKENS`
- `FRONTEND_URL`
- `CORS_ORIGINS`
- `MAX_RESUME_FILE_SIZE_BYTES`

## Local backend run

```bash
uvicorn backend.main:app --reload --port 8000
```
