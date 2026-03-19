# NLM Project

Ye repo ab single Vercel deploy ke liye ready kiya ja raha hai:

- frontend: Vite + React
- backend: FastAPI serverless function at `/api`
- mock interview: stateless request flow, so Vercel Functions cold starts me chat history break nahi hogi
- resume analyzer: PDF bytes ko memory me parse karta hai, temp-file dependency nahi

## Local development

1. Frontend dependencies install karo:

```bash
npm install
```

2. Python environment banao aur backend dependencies install karo:

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

3. Root `.env.example` aur `backend/.env.example` dekh kar env vars set karo.

4. FastAPI locally run karo:

```bash
uvicorn backend.main:app --reload --port 8000
```

5. Frontend run karo:

```bash
npm run dev
```

Vite proxy already `/api/*` ko `http://127.0.0.1:8000` par forward karta hai, isliye local frontend ke liye alag API URL dena optional hai.

## Vercel deploy

1. Repo GitHub par push karo.
2. Vercel me same repo import karo.
3. Project root repo root hi rakho.
4. Required environment variable set karo:
   - `GROQ_API_KEY`
5. Optional env vars:
   - `GROQ_MODEL`
   - `GROQ_TEMPERATURE`
   - `GROQ_MAX_TOKENS`
   - `FRONTEND_URL`
   - `CORS_ORIGINS`
   - `MAX_RESUME_FILE_SIZE_BYTES`
6. `VITE_API_BASE_URL` mat set karo agar frontend aur backend same Vercel project me deploy kar rahe ho.
7. Deploy ke baad check karo:
   - `/api/health`
   - `/interview`
   - `/resume`

## Notes

- Resume PDF ko 4 MB ke andar rakho. Vercel Functions request body limit ki wajah se bada file reject hoga.
- Preview deployments ke liye Vercel domains allowed hain.
- Active backend source `backend/main.py` hai, aur Vercel entrypoint `api/index.py`.
