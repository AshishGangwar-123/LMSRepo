---
title: AshishGPT
emoji: 🤖
colorFrom: blue
colorTo: indigo
sdk: streamlit
sdk_version: 1.42.0
app_file: app.py
pinned: false
license: mit
---

# AshishGPT

An AI Assistant powered by Groq (Llama 3.3, Mistral Saba).

## Setup Locally

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Create `.env` file with your Groq API Key:
   ```
   GROQ_API_KEY=gsk_your_key_here
   ```
3. Run the app:
   ```bash
   streamlit run app.py
   ```

## Deploy on Hugging Face Spaces

1. Create a new Space on [Hugging Face](https://huggingface.co/new-space).
2. Select **Streamlit** as the SDK.
3. Upload `app.py`, `requirements.txt`, and `README.md`.
4. Add your `GROQ_API_KEY` in the Space Settings > Repository secrets.
