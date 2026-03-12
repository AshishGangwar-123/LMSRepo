import { useState, useRef, useEffect } from 'react';
import {
    HiOutlinePaperAirplane,
    HiOutlineMicrophone,
    HiOutlineArrowPath,
    HiOutlineStopCircle,
} from 'react-icons/hi2';
import { RiRobot2Line } from 'react-icons/ri';
import './MockInterview.css';

const interviewQuestions = [
    "Tell me about a challenge you faced at work.",
    "What are your greatest strengths and weaknesses?",
    "Where do you see yourself in 5 years?",
    "Why should we hire you?",
    "Describe a time you showed leadership.",
    "How do you handle pressure and tight deadlines?",
];

const aiFeedbackResponses = [
    "Good answer! You showed problem-solving skills. Try adding more specific metrics to strengthen your response.",
    "Nice structure. Consider using the STAR method (Situation, Task, Action, Result) for even more impact.",
    "Great confidence in your delivery. Adding a concrete example would make this answer more memorable.",
    "Solid response! Try quantifying your achievements to make them more impactful.",
];

function MockInterview() {
    const [messages, setMessages] = useState([
        {
            role: 'ai',
            text: "Hello! I'm your AI Interview Coach. Let's practice some common interview questions. I'll ask you questions and provide feedback on your answers. Ready to begin?",
            timestamp: new Date(),
        },
        {
            role: 'ai',
            text: interviewQuestions[0],
            timestamp: new Date(),
            isQuestion: true,
        },
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [questionIndex, setQuestionIndex] = useState(0);
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = () => {
        if (!input.trim()) return;

        const userMsg = {
            role: 'user',
            text: input,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate AI response
        setTimeout(() => {
            const feedbackMsg = {
                role: 'ai',
                text: aiFeedbackResponses[questionIndex % aiFeedbackResponses.length],
                timestamp: new Date(),
                isFeedback: true,
            };

            setMessages((prev) => [...prev, feedbackMsg]);

            // Ask next question after feedback
            setTimeout(() => {
                const nextQ = (questionIndex + 1) % interviewQuestions.length;
                setQuestionIndex(nextQ);
                const questionMsg = {
                    role: 'ai',
                    text: interviewQuestions[nextQ],
                    timestamp: new Date(),
                    isQuestion: true,
                };
                setMessages((prev) => [...prev, questionMsg]);
                setIsTyping(false);
            }, 1200);
        }, 1500);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const resetInterview = () => {
        setMessages([
            {
                role: 'ai',
                text: "Let's start a fresh interview session. Ready?",
                timestamp: new Date(),
            },
            {
                role: 'ai',
                text: interviewQuestions[0],
                timestamp: new Date(),
                isQuestion: true,
            },
        ]);
        setQuestionIndex(0);
        setInput('');
    };

    return (
        <div className="interview-page">
            <div className="card interview-card">
                {/* Header */}
                <div className="interview-header">
                    <div className="interview-header-left">
                        <div className="interview-ai-avatar">
                            <RiRobot2Line size={20} />
                        </div>
                        <div>
                            <h3>AI Mock Interview</h3>
                            <span className="interview-status">
                                <span className="online-dot"></span>
                                AI Coach Online
                            </span>
                        </div>
                    </div>
                    <div className="interview-header-actions">
                        <button className="btn btn-outline btn-sm" onClick={resetInterview}>
                            <HiOutlineArrowPath size={14} />
                            New Session
                        </button>
                    </div>
                </div>

                {/* Chat area */}
                <div className="interview-chat">
                    {messages.map((msg, i) => (
                        <div
                            key={i}
                            className={`chat-message ${msg.role} ${msg.isQuestion ? 'question' : ''} ${msg.isFeedback ? 'feedback' : ''}`}
                        >
                            {msg.role === 'ai' && (
                                <div className="chat-avatar ai-avatar">
                                    <RiRobot2Line size={16} />
                                </div>
                            )}
                            <div className="chat-bubble">
                                <p>{msg.text}</p>
                                <span className="chat-time">
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="chat-message ai">
                            <div className="chat-avatar ai-avatar">
                                <RiRobot2Line size={16} />
                            </div>
                            <div className="chat-bubble typing-bubble">
                                <div className="typing-dots">
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                {/* Input area */}
                <div className="interview-input-area">
                    <div className="interview-input-wrapper">
                        <textarea
                            className="interview-input"
                            placeholder="Type your answer..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            rows={1}
                        />
                        <div className="interview-input-actions">
                            <button className="btn-icon mic-btn" title="Voice Input">
                                <HiOutlineMicrophone size={18} />
                            </button>
                            <button
                                className="btn btn-primary send-btn"
                                onClick={sendMessage}
                                disabled={!input.trim()}
                            >
                                <HiOutlinePaperAirplane size={16} />
                            </button>
                        </div>
                    </div>
                    <p className="input-hint">Press Enter to send, Shift+Enter for new line</p>
                </div>
            </div>
        </div>
    );
}

export default MockInterview;
