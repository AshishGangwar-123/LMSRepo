import os
import re
import json
import tempfile
from typing import List, Dict, Any, Optional

from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pypdf import PdfReader
from langchain_groq import ChatGroq

load_dotenv()

app = FastAPI(title="Resume Analyzer API")


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5175",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5175",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# =========================================================
# Skills DB
# =========================================================
SKILL_DB = [
    "python", "java", "c", "c++", "javascript", "typescript", "react", "node.js",
    "nodejs", "express", "mongodb", "sql", "mysql", "postgresql", "html", "css",
    "git", "github", "django", "flask", "fastapi", "machine learning",
    "deep learning", "nlp", "rag", "langchain", "docker", "aws", "rest api",
    "restful api", "streamlit", "pandas", "numpy", "scikit-learn", "opencv",
    "firebase", "tailwind", "bootstrap", "linux", "oop", "data structures",
    "algorithms", "api", "jwt", "socket.io", "redis", "kubernetes"
]

ACTION_VERBS = [
    "developed", "built", "designed", "created", "implemented", "optimized",
    "improved", "led", "managed", "automated", "deployed", "integrated",
    "analyzed", "engineered", "tested", "delivered"
]


# =========================================================
# Helpers
# =========================================================
def extract_text_from_pdf(pdf_path: str) -> str:
    reader = PdfReader(pdf_path)
    text_parts = []

    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text_parts.append(page_text)

    return "\n".join(text_parts).strip()


def clean_text(text: str) -> str:
    if not text:
        return ""
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def extract_email(text: str) -> Optional[str]:
    match = re.search(r"[\w\.-]+@[\w\.-]+\.\w+", text)
    return match.group(0) if match else None


def extract_phone(text: str) -> Optional[str]:
    patterns = [
        r"(\+91[\-\s]?)?[6-9]\d{9}",
        r"\+?\d[\d\-\s]{8,15}\d"
    ]
    for pattern in patterns:
        match = re.search(pattern, text)
        if match:
            return match.group(0).strip()
    return None


def extract_links(text: str) -> List[str]:
    links = re.findall(
        r"(https?://\S+|www\.\S+|linkedin\.com/\S+|github\.com/\S+)",
        text,
        flags=re.IGNORECASE
    )
    cleaned_links = [link.rstrip(".,;)") for link in links]
    return sorted(set(cleaned_links))


def extract_skills(text: str, skill_db: List[str]) -> List[str]:
    text_lower = text.lower()
    found_skills = []

    for skill in skill_db:
        pattern = r"\b" + re.escape(skill.lower()) + r"\b"
        if re.search(pattern, text_lower):
            found_skills.append(skill)

    return sorted(set(found_skills))


def extract_keywords_from_jd(jd_text: str, skill_db: List[str]) -> List[str]:
    if not jd_text or not jd_text.strip():
        return []

    jd_lower = jd_text.lower()
    matched = []

    for skill in skill_db:
        pattern = r"\b" + re.escape(skill.lower()) + r"\b"
        if re.search(pattern, jd_lower):
            matched.append(skill)

    return sorted(set(matched))


def compare_resume_with_jd(resume_skills: List[str], jd_keywords: List[str]):
    matched = [skill for skill in jd_keywords if skill in resume_skills]
    missing = [skill for skill in jd_keywords if skill not in resume_skills]

    if not jd_keywords:
        match_score = 0.0
    else:
        match_score = round((len(matched) / len(jd_keywords)) * 100, 2)

    return matched, missing, match_score


def detect_resume_sections(resume_text: str) -> Dict[str, bool]:
    text_lower = resume_text.lower()

    section_aliases = {
        "summary": ["summary", "profile", "objective", "about me"],
        "education": ["education", "academic", "qualification"],
        "experience": ["experience", "work experience", "internship", "employment"],
        "projects": ["project", "projects"],
        "skills": ["skills", "technical skills", "core skills"],
        "certifications": ["certification", "certifications", "licenses"],
        "achievements": ["achievement", "achievements", "awards"],
    }

    detected = {}
    for section, aliases in section_aliases.items():
        detected[section] = any(alias in text_lower for alias in aliases)

    return detected


def extract_action_verbs(resume_text: str) -> List[str]:
    text_lower = resume_text.lower()
    found = [
        verb for verb in ACTION_VERBS
        if re.search(r"\b" + re.escape(verb) + r"\b", text_lower)
    ]
    return sorted(set(found))


def has_quantified_achievements(resume_text: str) -> bool:
    patterns = [
        r"\b\d+%\b",
        r"\b\d+\+?\b",
        r"\b\d+\s*(users|projects|clients|days|months|years)\b",
        r"\b(increased|reduced|improved|boosted|saved)\b.*\b\d+"
    ]
    text_lower = resume_text.lower()
    return any(re.search(pattern, text_lower) for pattern in patterns)


def calculate_ats_analysis(
    email: Optional[str],
    phone: Optional[str],
    links: List[str],
    skills: List[str],
    resume_text: str,
    jd_keywords: List[str],
    matched_keywords: List[str],
) -> Dict[str, Any]:
    ats_score = 0
    strengths = []
    improvements = []

    if email:
        ats_score += 8
        strengths.append("Email address is present.")
    else:
        improvements.append("Add a professional email address.")

    if phone:
        ats_score += 8
        strengths.append("Phone number is present.")
    else:
        improvements.append("Add a phone number.")

    if links:
        ats_score += 8
        strengths.append("Professional links are included.")
    else:
        improvements.append("Add LinkedIn or GitHub/profile links if relevant.")

    if len(skills) >= 8:
        ats_score += 15
        strengths.append("Good variety of technical skills detected.")
    elif len(skills) >= 4:
        ats_score += 10
        strengths.append("Relevant skills are present.")
    else:
        improvements.append("Add a clearer technical skills section.")

    sections = detect_resume_sections(resume_text)

    if sections["education"]:
        ats_score += 8
    else:
        improvements.append("Add an Education section.")

    if sections["experience"]:
        ats_score += 12
        strengths.append("Experience or internship section detected.")
    else:
        improvements.append("Add Experience or Internship details if available.")

    if sections["projects"]:
        ats_score += 12
        strengths.append("Projects section is present.")
    else:
        improvements.append("Add a Projects section to showcase practical work.")

    if sections["skills"]:
        ats_score += 10
    else:
        improvements.append("Add a dedicated Skills section.")

    if sections["summary"]:
        ats_score += 6
        strengths.append("Profile/Summary section is present.")
    else:
        improvements.append("Add a short professional summary at the top.")

    if sections["certifications"]:
        ats_score += 4

    if sections["achievements"]:
        ats_score += 4

    action_verbs_found = extract_action_verbs(resume_text)
    if action_verbs_found:
        ats_score += 8
        strengths.append("Strong action verbs are used in resume points.")
    else:
        improvements.append("Use stronger action verbs like developed, built, optimized, led.")

    if has_quantified_achievements(resume_text):
        ats_score += 10
        strengths.append("Some quantified achievements or measurable details are present.")
    else:
        improvements.append("Add quantified results, metrics, or impact where possible.")

    if jd_keywords:
        if len(matched_keywords) == len(jd_keywords):
            ats_score += 15
            strengths.append("Resume strongly matches the provided job description keywords.")
        elif len(matched_keywords) >= max(1, len(jd_keywords) // 2):
            ats_score += 10
            strengths.append("Resume matches a fair number of job description keywords.")
        elif matched_keywords:
            ats_score += 5
        else:
            improvements.append("Tailor the resume to the job description with more relevant keywords.")

    ats_score = min(100, ats_score)

    return {
        "ats_score": ats_score,
        "strengths_rule_based": strengths,
        "improvements_rule_based": improvements,
        "detected_sections": sections,
        "action_verbs_found": action_verbs_found,
    }


def parse_llm_json(text: str) -> Dict[str, Any]:
    text = text.strip()

    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    match = re.search(r"\{.*\}", text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group(0))
        except json.JSONDecodeError:
            pass

    return {
        "summary": "",
        "strengths": [],
        "weaknesses": [],
        "suggestions": [],
        "improved_summary": ""
    }


def generate_llm_feedback(llm: ChatGroq, resume_text: str, analysis_data: Dict[str, Any]) -> Dict[str, Any]:
    prompt = f"""
You are an expert ATS resume analyzer for job seekers.

Your task is to analyze the candidate's resume and provide improvement-focused feedback.
Do NOT act like a recruiter or hiring manager.
Treat this as a resume optimization tool for the candidate.

Resume text:
{resume_text[:5000]}

Structured analysis:
{json.dumps(analysis_data, indent=2)}

Return valid JSON only with exactly these keys:
summary
strengths
weaknesses
suggestions
improved_summary

Rules:
- "summary" should be 2-3 short lines about overall resume quality.
- "strengths" should be a JSON array of short strings.
- "weaknesses" should be a JSON array of short strings.
- "suggestions" should be a JSON array of practical improvement suggestions.
- "improved_summary" should be a better professional summary the user can paste into resume.
- Keep the tone supportive, user-facing, and professional.
- No markdown.
- No extra text before or after JSON.
"""

    response = llm.invoke(prompt)
    return parse_llm_json(response.content)


def analyze_resume_file(pdf_path: str, job_description: str = "") -> Dict[str, Any]:
    raw_text = extract_text_from_pdf(pdf_path)
    cleaned_text = clean_text(raw_text)

    if not cleaned_text:
        raise ValueError("Could not extract text from the uploaded resume. This PDF may be scanned or image-based.")

    email = extract_email(cleaned_text)
    phone = extract_phone(cleaned_text)
    links = extract_links(cleaned_text)
    resume_skills = extract_skills(cleaned_text, SKILL_DB)

    jd_keywords = extract_keywords_from_jd(job_description, SKILL_DB)
    matched_keywords, missing_keywords, jd_match_score = compare_resume_with_jd(
        resume_skills,
        jd_keywords
    )

    rule_analysis = calculate_ats_analysis(
        email=email,
        phone=phone,
        links=links,
        skills=resume_skills,
        resume_text=cleaned_text,
        jd_keywords=jd_keywords,
        matched_keywords=matched_keywords,
    )

    base_analysis = {
        "contact_details": {
            "email": email,
            "phone": phone,
            "links": links
        },
        "resume_skills": resume_skills,
        "job_description_keywords": jd_keywords,
        "matched_keywords": matched_keywords,
        "missing_keywords": missing_keywords,
        "keyword_match_score": jd_match_score,
        "ats_score": rule_analysis["ats_score"],
        "resume_score": rule_analysis["ats_score"],
        "strengths_rule_based": rule_analysis["strengths_rule_based"],
        "improvements_rule_based": rule_analysis["improvements_rule_based"],
        "detected_sections": rule_analysis["detected_sections"],
        "action_verbs_found": rule_analysis["action_verbs_found"],
    }

    llm_feedback = {
        "summary": "",
        "strengths": [],
        "weaknesses": [],
        "suggestions": [],
        "improved_summary": ""
    }

    groq_api_key = os.getenv("GROQ_API_KEY")
    if groq_api_key:
        try:
            llm = ChatGroq(model="llama-3.1-8b-instant")
            llm_feedback = generate_llm_feedback(llm, cleaned_text, base_analysis)
        except Exception:
            pass

    final_result = {
        "atsScore": base_analysis["ats_score"],
        "keywordMatch": base_analysis["keyword_match_score"],
        "resumeScore": base_analysis["resume_score"],
        "missingKeywords": base_analysis["missing_keywords"],
        "matchedKeywords": base_analysis["matched_keywords"],
        "strengths": llm_feedback["strengths"] if llm_feedback["strengths"] else base_analysis["strengths_rule_based"],
        "improvements": llm_feedback["suggestions"] if llm_feedback["suggestions"] else base_analysis["improvements_rule_based"],
        "coverLetterSkills": [
            {
                "skill": "Keyword Alignment",
                "score": round(min(3.0, (base_analysis["keyword_match_score"] / 100) * 3), 1),
                "status": "good" if base_analysis["keyword_match_score"] >= 60 else "warning"
            },
            {
                "skill": "ATS Readability",
                "score": round(min(3.0, (base_analysis["ats_score"] / 100) * 3), 1),
                "status": "good" if base_analysis["ats_score"] >= 70 else "warning"
            },
            {
                "skill": "Content Strength",
                "score": round(min(3.0, (len(base_analysis["resume_skills"]) / 10) * 3), 1),
                "status": "good" if len(base_analysis["resume_skills"]) >= 6 else "warning"
            }
        ],
        "summary": llm_feedback.get("summary", ""),
        "improvedSummary": llm_feedback.get("improved_summary", ""),
        "details": {
            "email": email,
            "phone": phone,
            "links": links,
            "skillsFound": resume_skills,
            "detectedSections": base_analysis["detected_sections"],
            "actionVerbsFound": base_analysis["action_verbs_found"]
        }
    }

    return final_result


@app.get("/")
def home():
    return {"message": "Resume Analyzer API is running"}


@app.post("/analyze-resume")
async def analyze_resume(
    resume: UploadFile = File(...),
    job_description: str = Form("")
):
    if not resume:
        raise HTTPException(status_code=400, detail="Resume file is required.")

    filename = (resume.filename or "").lower()
    content_type = (resume.content_type or "").lower()

    allowed_pdf_types = {
        "application/pdf",
        "application/x-pdf",
        "binary/octet-stream",
        "application/octet-stream"
    }

    is_pdf = filename.endswith(".pdf") or content_type in allowed_pdf_types

    if not is_pdf:
        raise HTTPException(status_code=400, detail="Only PDF resumes are supported right now.")

    temp_file_path = None

    try:
        file_bytes = await resume.read()

        if not file_bytes:
            raise HTTPException(status_code=400, detail="Uploaded resume file is empty.")

        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
            temp_file.write(file_bytes)
            temp_file_path = temp_file.name

        result = analyze_resume_file(temp_file_path, job_description)
        return result

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Resume analysis failed: {str(e)}")
    finally:
        if temp_file_path and os.path.exists(temp_file_path):
            os.remove(temp_file_path)