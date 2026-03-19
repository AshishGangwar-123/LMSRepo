import { useAuth } from '../context/useAuth';
import { Link } from 'react-router-dom';
import {
    HiOutlineMicrophone,
    HiOutlineDocumentText,
    HiOutlineChatBubbleLeftRight,
    HiOutlineArrowTrendingUp,
    HiOutlineSparkles,
    HiOutlineChevronRight,
} from 'react-icons/hi2';
import ScoreCircle from '../components/ScoreCircle';
import './Dashboard.css';

function Dashboard() {
    const { user } = useAuth();
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

    return (
        <div className="dashboard stagger-children">
            {/* Welcome banner */}
            <div className="welcome-banner">
                <div className="welcome-text">
                    <h2>{greeting}, {user?.name} 👋</h2>
                    <p>Build employability skills with AI-powered practice and feedback.</p>
                </div>
                <div className="welcome-quick-actions">
                    <Link to="/speaking" className="btn btn-primary">
                        <HiOutlineSparkles size={16} />
                        Continue Exercise
                    </Link>
                </div>
            </div>

            {/* Score cards row */}
            <div className="score-cards-row">
                <div className="score-card card">
                    <div className="score-card-header">
                        <span className="score-card-label">Confidence Level</span>
                        <span className="badge badge-success">+5% this week</span>
                    </div>
                    <div className="score-card-body">
                        <ScoreCircle value={user?.scores?.confidence || 76} size={100} />
                    </div>
                    <div className="score-card-footer">
                        <span>Improved</span>
                    </div>
                </div>

                <Link to="/speaking" className="score-card card score-card-action">
                    <div className="score-card-icon" style={{ background: 'linear-gradient(135deg, #818cf8, #6366f1)' }}>
                        <HiOutlineMicrophone size={22} />
                    </div>
                    <div className="score-card-info">
                        <span className="score-card-title">Speaking Practice</span>
                        <div className="mini-progress">
                            <div className="progress-bar" style={{ height: '6px' }}>
                                <div className="progress-bar-fill" style={{ width: '79%' }}></div>
                            </div>
                            <span className="mini-progress-label">79% Complete</span>
                        </div>
                    </div>
                    <HiOutlineChevronRight size={18} className="card-arrow" />
                </Link>

                <Link to="/resume" className="score-card card score-card-action">
                    <div className="score-card-icon" style={{ background: 'linear-gradient(135deg, #34d399, #10b981)' }}>
                        <HiOutlineDocumentText size={22} />
                    </div>
                    <div className="score-card-info">
                        <span className="score-card-title">Resume Analyzer</span>
                        <div className="score-card-stat">
                            <span className="stat-value">81%</span>
                            <span className="stat-label">ATS Ready Score</span>
                        </div>
                    </div>
                    <HiOutlineChevronRight size={18} className="card-arrow" />
                </Link>
            </div>

            {/* Middle row: activities + progress */}
            <div className="dashboard-grid">
                {/* Practice modules */}
                <div className="card practice-card">
                    <h3 className="card-title">Practice Modules</h3>
                    <div className="module-list">
                        <Link to="/speaking" className="module-item">
                            <div className="module-icon" style={{ background: '#eef2ff', color: '#4a6cf7' }}>
                                <HiOutlineMicrophone size={20} />
                            </div>
                            <div className="module-info">
                                <span className="module-name">Speaking Exercise</span>
                                <span className="module-desc">AI-analyzed speech coaching</span>
                            </div>
                            <span className="badge badge-info">New</span>
                        </Link>
                        <Link to="/interview" className="module-item">
                            <div className="module-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
                                <HiOutlineChatBubbleLeftRight size={20} />
                            </div>
                            <div className="module-info">
                                <span className="module-name">Mock Interview</span>
                                <span className="module-desc">AI-powered interview simulation</span>
                            </div>
                            <span className="badge badge-warning">Practice</span>
                        </Link>
                        <Link to="/resume" className="module-item">
                            <div className="module-icon" style={{ background: '#dcfce7', color: '#16a34a' }}>
                                <HiOutlineDocumentText size={20} />
                            </div>
                            <div className="module-info">
                                <span className="module-name">Resume Analyzer</span>
                                <span className="module-desc">JD-matched resume optimization</span>
                            </div>
                            <span className="badge badge-success">Ready</span>
                        </Link>
                    </div>
                </div>

                {/* Employability report preview */}
                <div className="card report-preview-card">
                    <div className="report-preview-header">
                        <h3 className="card-title">Employability Report</h3>
                        <Link to="/report" className="btn btn-outline btn-sm">
                            View Full Report <HiOutlineChevronRight size={14} />
                        </Link>
                    </div>
                    <div className="report-scores">
                        <div className="report-score-item">
                            <div className="report-score-bar">
                                <span className="report-score-label">Communication</span>
                                <span className="report-score-value">72%</span>
                            </div>
                            <div className="progress-bar">
                                <div className="progress-bar-fill" style={{ width: '72%' }}></div>
                            </div>
                        </div>
                        <div className="report-score-item">
                            <div className="report-score-bar">
                                <span className="report-score-label">Confidence</span>
                                <span className="report-score-value">76%</span>
                            </div>
                            <div className="progress-bar">
                                <div className="progress-bar-fill" style={{ width: '76%' }}></div>
                            </div>
                        </div>
                        <div className="report-score-item">
                            <div className="report-score-bar">
                                <span className="report-score-label">Professional Readiness</span>
                                <span className="report-score-value">81%</span>
                            </div>
                            <div className="progress-bar">
                                <div className="progress-bar-fill" style={{ width: '81%' }}></div>
                            </div>
                        </div>
                        <div className="report-score-item">
                            <div className="report-score-bar">
                                <span className="report-score-label">Resume Match Index</span>
                                <span className="report-score-value">68%</span>
                            </div>
                            <div className="progress-bar">
                                <div className="progress-bar-fill" style={{ width: '68%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activities */}
                <div className="card activities-card">
                    <h3 className="card-title">Recent Activities</h3>
                    <div className="activity-list">
                        <div className="activity-item">
                            <div className="activity-dot" style={{ background: '#4a6cf7' }}></div>
                            <div className="activity-content">
                                <span className="activity-text">Completed Speaking Test #5</span>
                                <span className="activity-time">2 hours ago</span>
                            </div>
                            <span className="badge badge-success">+3pts</span>
                        </div>
                        <div className="activity-item">
                            <div className="activity-dot" style={{ background: '#f59e0b' }}></div>
                            <div className="activity-content">
                                <span className="activity-text">Submitted Resume v3</span>
                                <span className="activity-time">Yesterday</span>
                            </div>
                        </div>
                        <div className="activity-item">
                            <div className="activity-dot" style={{ background: '#22c55e' }}></div>
                            <div className="activity-content">
                                <span className="activity-text">Scored 85% on Interview Sim</span>
                                <span className="activity-time">2 days ago</span>
                            </div>
                            <span className="badge badge-info">Best</span>
                        </div>
                        <div className="activity-item">
                            <div className="activity-dot" style={{ background: '#8b5cf6' }}></div>
                            <div className="activity-content">
                                <span className="activity-text">Business Letter Writing</span>
                                <span className="activity-time">3 days ago</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Personalized Journey */}
                <div className="card journey-card">
                    <h3 className="card-title">
                        <HiOutlineArrowTrendingUp size={18} />
                        Personalized Journey
                    </h3>
                    <div className="journey-timeline">
                        <div className="journey-step completed">
                            <div className="journey-dot"></div>
                            <div className="journey-info">
                                <span className="journey-step-title">Foundation Communication</span>
                                <span className="journey-step-status">Completed</span>
                            </div>
                        </div>
                        <div className="journey-step completed">
                            <div className="journey-dot"></div>
                            <div className="journey-info">
                                <span className="journey-step-title">Personality & Speaking</span>
                                <span className="journey-step-status">Completed</span>
                            </div>
                        </div>
                        <div className="journey-step active">
                            <div className="journey-dot"></div>
                            <div className="journey-info">
                                <span className="journey-step-title">Professional Writing</span>
                                <span className="journey-step-status">In Progress</span>
                            </div>
                        </div>
                        <div className="journey-step">
                            <div className="journey-dot"></div>
                            <div className="journey-info">
                                <span className="journey-step-title">Placement Readiness</span>
                                <span className="journey-step-status">Locked</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default Dashboard;
