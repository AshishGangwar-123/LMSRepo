import ScoreCircle from '../components/ScoreCircle';
import {
    HiOutlineArrowTrendingUp,
    HiOutlineChartBarSquare,
    HiOutlineSparkles,
    HiOutlineArrowDownTray,
    HiOutlineCheckCircle,
    HiOutlineExclamationTriangle,
} from 'react-icons/hi2';
import './EmployabilityReport.css';

const reportData = {
    overallReadiness: 78,
    scores: [
        { label: 'Communication Score', value: 72, change: '+4%' },
        { label: 'Confidence Level', value: 76, change: '+5%' },
        { label: 'Professional Readiness', value: 81, change: '+2%' },
        { label: 'Resume Match Index', value: 68, change: '+8%' },
    ],
    skills: [
        { name: 'Public Speaking', level: 72, status: 'improving' },
        { name: 'Email Writing', level: 85, status: 'strong' },
        { name: 'Interview Skills', level: 68, status: 'needs work' },
        { name: 'Vocabulary', level: 70, status: 'improving' },
        { name: 'Active Listening', level: 78, status: 'strong' },
        { name: 'Body Language', level: 65, status: 'needs work' },
    ],
    attempts: [
        { module: 'Speaking Exercise', count: 12, avgScore: 74, best: 86 },
        { module: 'Mock Interview', count: 8, avgScore: 71, best: 85 },
        { module: 'Resume Upload', count: 5, avgScore: 78, best: 82 },
        { module: 'Writing Practice', count: 15, avgScore: 80, best: 92 },
    ],
    weeklyProgress: [62, 65, 68, 71, 70, 74, 76, 78],
    recommendations: [
        'Practice mock interviews at least 3 times per week to improve confidence scores.',
        'Focus on vocabulary building — current score is below target threshold.',
        'Upload an updated resume with latest project details for better ATS scores.',
        'Record daily 2-minute self-introductions to track speaking clarity improvement.',
    ],
};

function EmployabilityReport() {
    const maxVal = Math.max(...reportData.weeklyProgress);

    return (
        <div className="report-page animate-fadeIn">
            {/* Header */}
            <div className="report-page-header">
                <div>
                    <h2 className="report-page-title">
                        <HiOutlineChartBarSquare size={24} />
                        Employability Report
                    </h2>
                    <p className="report-page-subtitle">Your comprehensive skill assessment and growth tracking</p>
                </div>
                <button className="btn btn-primary">
                    <HiOutlineArrowDownTray size={16} />
                    Download Report
                </button>
            </div>

            {/* Overview row */}
            <div className="report-overview stagger-children">
                <div className="card report-readiness-card">
                    <h3>Employability Readiness Index</h3>
                    <div className="readiness-center">
                        <ScoreCircle value={reportData.overallReadiness} size={160} strokeWidth={12} />
                    </div>
                    <p className="readiness-status">
                        <HiOutlineArrowTrendingUp size={16} />
                        <span>Improving — <strong>+6%</strong> this month</span>
                    </p>
                </div>

                {/* Score cards */}
                <div className="report-score-cards">
                    {reportData.scores.map((s, i) => (
                        <div key={i} className="card report-metric-card">
                            <span className="report-metric-label">{s.label}</span>
                            <div className="report-metric-row">
                                <span className="report-metric-value">{s.value}%</span>
                                <span className="badge badge-success">{s.change}</span>
                            </div>
                            <div className="progress-bar" style={{ height: '6px' }}>
                                <div className="progress-bar-fill" style={{ width: `${s.value}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Middle grid */}
            <div className="report-grid">
                {/* Skill breakdown */}
                <div className="card report-skill-card">
                    <h3 className="card-title">Skill Breakdown</h3>
                    <div className="skill-list">
                        {reportData.skills.map((skill, i) => (
                            <div key={i} className="skill-row">
                                <div className="skill-info">
                                    <span className="skill-name">{skill.name}</span>
                                    <span className={`skill-status ${skill.status.replace(' ', '-')}`}>
                                        {skill.status === 'strong' && <HiOutlineCheckCircle size={14} />}
                                        {skill.status === 'needs work' && <HiOutlineExclamationTriangle size={14} />}
                                        {skill.status === 'improving' && <HiOutlineArrowTrendingUp size={14} />}
                                        {skill.status}
                                    </span>
                                </div>
                                <div className="skill-bar-wrapper">
                                    <div className="progress-bar" style={{ height: '8px' }}>
                                        <div className="progress-bar-fill" style={{ width: `${skill.level}%` }}></div>
                                    </div>
                                    <span className="skill-pct">{skill.level}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Weekly progress chart */}
                <div className="card report-chart-card">
                    <h3 className="card-title">
                        <HiOutlineSparkles size={16} />
                        Weekly Progress
                    </h3>
                    <div className="chart-container">
                        <div className="bar-chart">
                            {reportData.weeklyProgress.map((val, i) => (
                                <div key={i} className="bar-wrapper">
                                    <div
                                        className="bar"
                                        style={{ height: `${(val / maxVal) * 100}%` }}
                                        title={`Week ${i + 1}: ${val}%`}
                                    >
                                        <span className="bar-value">{val}</span>
                                    </div>
                                    <span className="bar-label">W{i + 1}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Practice attempts */}
                <div className="card report-attempts-card">
                    <h3 className="card-title">Practice Attempts</h3>
                    <div className="attempts-table">
                        <div className="attempts-header">
                            <span>Module</span>
                            <span>Attempts</span>
                            <span>Avg Score</span>
                            <span>Best</span>
                        </div>
                        {reportData.attempts.map((a, i) => (
                            <div key={i} className="attempts-row">
                                <span className="attempts-module">{a.module}</span>
                                <span className="attempts-count">{a.count}</span>
                                <span className="attempts-avg">{a.avgScore}%</span>
                                <span className="attempts-best badge badge-success">{a.best}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recommendations */}
                <div className="card report-recs-card">
                    <h3 className="card-title">AI Recommendations</h3>
                    <div className="rec-list">
                        {reportData.recommendations.map((r, i) => (
                            <div key={i} className="rec-item">
                                <span className="rec-number">{i + 1}</span>
                                <p>{r}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EmployabilityReport;
