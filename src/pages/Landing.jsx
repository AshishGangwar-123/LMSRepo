import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { RiRobot2Line } from 'react-icons/ri';
import { HiOutlineSparkles, HiOutlineAcademicCap, HiOutlineChartBar } from 'react-icons/hi2';
import { FcGoogle } from 'react-icons/fc';
import './Landing.css';

function Landing() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        login({ name: name || 'Rajat', email });
    };

    return (
        <div className="landing">
            {/* Animated background */}
            <div className="landing-bg">
                <div className="landing-orb landing-orb-1"></div>
                <div className="landing-orb landing-orb-2"></div>
                <div className="landing-orb landing-orb-3"></div>
            </div>

            <div className="landing-container">
                {/* Left — Hero */}
                <div className="landing-hero animate-fadeInUp">
                    <div className="hero-badge">
                        <HiOutlineSparkles size={14} />
                        <span>AI-Powered Learning</span>
                    </div>
                    <h1 className="hero-title">
                        Build Confidence.<br />
                        <span className="gradient-text">Build Career.</span>
                    </h1>
                    <p className="hero-subtitle">
                        Your AI-Driven Employability Coach. Practice communication, ace interviews,
                        and optimize your resume — all powered by intelligent AI feedback loops.
                    </p>

                    <div className="hero-features">
                        <div className="hero-feature">
                            <div className="hero-feature-icon">
                                <HiOutlineMicrophoneIcon />
                            </div>
                            <div>
                                <strong>Speaking Practice</strong>
                                <span>AI-analyzed speech coaching</span>
                            </div>
                        </div>
                        <div className="hero-feature">
                            <div className="hero-feature-icon">
                                <HiOutlineAcademicCap size={20} />
                            </div>
                            <div>
                                <strong>Mock Interviews</strong>
                                <span>Real-time AI conversations</span>
                            </div>
                        </div>
                        <div className="hero-feature">
                            <div className="hero-feature-icon">
                                <HiOutlineChartBar size={20} />
                            </div>
                            <div>
                                <strong>Resume Analysis</strong>
                                <span>JD-matched optimization</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right — Auth Card */}
                <div className="landing-auth-wrapper animate-fadeInUp" style={{ animationDelay: '200ms' }}>
                    <div className="auth-card glass-card">
                        <div className="auth-header">
                            <div className="auth-logo">
                                <RiRobot2Line size={22} />
                            </div>
                            <h2>{isSignUp ? 'Get Started' : 'Welcome Back'}</h2>
                            <p>{isSignUp ? 'Create your account' : 'Sign in to continue learning'}</p>
                        </div>

                        <form className="auth-form" onSubmit={handleSubmit}>
                            {isSignUp && (
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        placeholder="Enter your name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                            )}
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    className="input-field"
                                    placeholder="you@college.edu"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    className="input-field"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <button type="submit" className="btn btn-primary btn-lg auth-submit">
                                {isSignUp ? 'Create Account' : 'Continue'}
                            </button>

                            <div className="auth-divider">
                                <span>or</span>
                            </div>

                            <button type="button" className="btn btn-secondary btn-lg auth-google" onClick={handleSubmit}>
                                <FcGoogle size={20} />
                                Continue with Google
                            </button>
                        </form>

                        <p className="auth-toggle">
                            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                            <button onClick={() => setIsSignUp(!isSignUp)}>
                                {isSignUp ? 'Sign In' : 'Get Started'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function HiOutlineMicrophoneIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
        </svg>
    );
}

export default Landing;
