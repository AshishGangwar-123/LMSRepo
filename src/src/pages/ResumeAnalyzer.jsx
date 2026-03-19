import { useState } from 'react';
import {
    HiOutlineDocumentArrowUp,
    HiOutlineClipboardDocumentCheck,
    HiOutlineSparkles,
    HiOutlineArrowDownTray,
    HiOutlineCheckCircle,
    HiOutlineExclamationTriangle,
    HiOutlineXCircle,
} from 'react-icons/hi2';
import ScoreCircle from '../components/ScoreCircle';
import { apiUrl } from '../api';
import './ResumeAnalyzer.css';

const mockAnalysis = {
    atsScore: 74,
    keywordMatch: 3.0,
    resumeScore: 82,
    missingKeywords: ['Agile Methodology', 'CI/CD Pipeline', 'RESTful APIs', 'Unit Testing'],
    matchedKeywords: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'Git'],
    strengths: [
        'Strong technical skills section',
        'Relevant project experience',
        'Clear education details',
    ],
    improvements: [
        'Add more quantified achievements',
        'Include relevant certifications',
        'Tailor summary to target JD',
        'Add action verbs to bullet points',
    ],
    coverLetterSkills: [
        { skill: 'Concise Language', score: 3.0, status: 'good' },
        { skill: 'Adequate Speech Range', score: 2.8, status: 'good' },
        { skill: 'History', score: 2.5, status: 'warning' },
    ],
};

function ResumeAnalyzer() {
    const [resumeFile, setResumeFile] = useState(null);
    const [jdText, setJdText] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setResumeFile(file);
        }
    };

    const handleAnalyze = async () => {
        if (!resumeFile) return;

        setIsAnalyzing(true);

        try {
            const formData = new FormData();
            formData.append('resume', resumeFile);
            formData.append('job_description', jdText);

            const response = await fetch(apiUrl('/api/resume/analyze'), {
                method: 'POST',
                body: formData,
            });

            let result = {};
            try {
                result = await response.json();
            } catch {
                result = {};
            }

            if (!response.ok) {
                throw new Error(result.detail || 'Resume analysis failed');
            }

            setAnalysisResult(result);
            setShowResults(true);
        } catch (error) {
            console.error('Analyze error:', error);
            alert(error.message || 'Resume analysis failed');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (
            file &&
            (
                file.type === 'application/pdf' ||
                file.name.toLowerCase().endsWith('.pdf')
            )
        ) {
            setResumeFile(file);
        }
    };

    const data = analysisResult || mockAnalysis;

    return (
        <div className="resume-page">
            {!showResults ? (
                <div className="resume-upload-section animate-fadeInUp">
                    <div className="card upload-card">
                        <h2 className="upload-title">
                            <HiOutlineDocumentArrowUp size={24} />
                            Resume Analyzer
                        </h2>
                        <p className="upload-desc">
                            Upload your resume and paste a Job Description to get AI-powered optimization suggestions.
                        </p>

                        <div
                            className={`drop-zone ${resumeFile ? 'has-file' : ''}`}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleDrop}
                        >
                            {resumeFile ? (
                                <div className="file-preview">
                                    <HiOutlineClipboardDocumentCheck size={32} />
                                    <span className="file-name">{resumeFile.name}</span>
                                    <span className="file-size">{(resumeFile.size / 1024).toFixed(1)} KB</span>
                                    <button
                                        className="btn btn-sm btn-outline"
                                        onClick={() => setResumeFile(null)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ) : (
                                <div className="drop-content">
                                    <div className="drop-icon">
                                        <HiOutlineDocumentArrowUp size={28} />
                                    </div>
                                    <p><strong>Drop your resume here</strong></p>
                                    <p>or</p>
                                    <label className="btn btn-outline btn-sm upload-label">
                                        Browse Files
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={handleFileUpload}
                                            hidden
                                        />
                                    </label>
                                    <span className="drop-hint">Supports PDF only</span>
                                </div>
                            )}
                        </div>

                        <div className="jd-section">
                            <label className="jd-label">Job Description (Optional)</label>
                            <textarea
                                className="input-field jd-input"
                                placeholder="Paste the job description here for JD-matched analysis..."
                                value={jdText}
                                onChange={(e) => setJdText(e.target.value)}
                                rows={5}
                            />
                        </div>

                        <button
                            className="btn btn-primary btn-lg analyze-btn"
                            onClick={handleAnalyze}
                            disabled={!resumeFile || isAnalyzing}
                        >
                            {isAnalyzing ? (
                                <>
                                    <div className="analyzing-spinner"></div>
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <HiOutlineSparkles size={18} />
                                    Analyze Resume
                                </>
                            )}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="resume-results animate-fadeInUp">
                    <div className="results-header">
                        <h2>Analysis Report</h2>
                        <div className="results-actions">
                            <button
                                className="btn btn-outline btn-sm"
                                onClick={() => {
                                    setShowResults(false);
                                    setAnalysisResult(null);
                                }}
                            >
                                Upload New
                            </button>
                            <button className="btn btn-primary btn-sm">
                                <HiOutlineArrowDownTray size={14} />
                                Download Report
                            </button>
                        </div>
                    </div>

                    <div className="results-grid">
                        <div className="card results-score-card">
                            <h3>ATS Compatibility</h3>
                            <div className="results-score-center">
                                <ScoreCircle value={data.atsScore || 0} size={140} strokeWidth={10} />
                            </div>
                            <div className="score-detail">
                                <span>Keyword Match</span>
                                <span className="score-detail-value">{data.keywordMatch ?? 0}</span>
                            </div>
                            <div className="score-detail">
                                <span>Algorithm Match</span>
                                <span className="score-detail-value">8.1</span>
                            </div>
                        </div>

                        <div className="card results-progress-card">
                            <h3>Progress in Review</h3>
                            <div className="results-score-center">
                                <ScoreCircle value={data.resumeScore || 0} size={140} strokeWidth={10} />
                            </div>
                            <div className="progress-items">
                                <div className="progress-item">
                                    <span>Resume Analyzer</span>
                                    <span className="progress-pct">8.6%</span>
                                    <HiOutlineCheckCircle size={16} className="progress-check" />
                                </div>
                                <div className="progress-item">
                                    <span>Mock Interview</span>
                                    <span className="progress-pct">30%</span>
                                    <HiOutlineCheckCircle size={16} className="progress-check" />
                                </div>
                            </div>
                        </div>

                        <div className="card keyword-card">
                            <h3>Keyword Analysis</h3>
                            <div className="keyword-section">
                                <h4>
                                    <HiOutlineCheckCircle size={16} className="text-success" />
                                    Matched Keywords
                                </h4>
                                <div className="keyword-tags">
                                    {data.matchedKeywords?.map((kw, i) => (
                                        <span key={i} className="badge badge-success">{kw}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="keyword-section">
                                <h4>
                                    <HiOutlineExclamationTriangle size={16} className="text-warning" />
                                    Missing Keywords
                                </h4>
                                <div className="keyword-tags">
                                    {data.missingKeywords?.map((kw, i) => (
                                        <span key={i} className="badge badge-warning">{kw}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="card coverletter-card">
                            <h3>Cover Letter Skills</h3>
                            <div className="coverletter-items">
                                {data.coverLetterSkills?.map((s, i) => (
                                    <div key={i} className="coverletter-item">
                                        <span className="coverletter-skill">{s.skill}</span>
                                        <span className="coverletter-score">{s.score}</span>

                                        {s.status === 'good' ? (
                                            <HiOutlineCheckCircle
                                                size={16}
                                                style={{ color: '#22c55e' }}
                                            />
                                        ) : s.status === 'warning' ? (
                                            <HiOutlineExclamationTriangle
                                                size={16}
                                                style={{ color: '#f59e0b' }}
                                            />
                                        ) : (
                                            <HiOutlineXCircle
                                                size={16}
                                                style={{ color: '#ef4444' }}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="card suggestions-card">
                            <h3>Improvement Suggestions</h3>
                            <div className="suggestion-list">
                                {data.improvements?.map((s, i) => (
                                    <div key={i} className="suggestion-item">
                                        <span className="suggestion-number">{i + 1}</span>
                                        <span>{s}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="card strengths-card">
                            <h3>Strengths</h3>
                            <div className="strength-list">
                                {data.strengths?.map((s, i) => (
                                    <div key={i} className="strength-item">
                                        <HiOutlineCheckCircle size={16} className="text-success" />
                                        <span>{s}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ResumeAnalyzer;
