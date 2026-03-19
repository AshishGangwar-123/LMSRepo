import { useState, useRef, useEffect } from 'react';
import {
  HiOutlinePaperAirplane,
  HiOutlineMicrophone,
  HiOutlineArrowPath,
} from 'react-icons/hi2';
import { RiRobot2Line } from 'react-icons/ri';
import { apiUrl } from '../api';
import './MockInterview.css';

function MockInterview() {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: "Hello! I'm your AI Interview Coach. Ready to begin?",
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);
  const [sessionId] = useState(() => crypto.randomUUID());

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = async () => {
    if (!input.trim() || isTyping) return;

    const userText = input.trim();
    const history = messages.map((message) => ({
      role: message.role,
      text: message.text,
    }));

    const userMsg = {
      role: 'user',
      text: userText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch(apiUrl('/api/chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          history,
          message: userText,
        }),
      });

      const rawResponse = await res.text();
      let data = {};

      if (rawResponse) {
        try {
          data = JSON.parse(rawResponse);
        } catch {
          throw new Error(
            rawResponse.trim() || `Request failed with status ${res.status}`
          );
        }
      }

      if (!res.ok) {
        throw new Error(
          data?.detail ||
          data?.message ||
          `Request failed with status ${res.status}`
        );
      }

      const aiMsg = {
        role: 'ai',
        text: data.reply || 'No reply received from backend.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          text: `Error: ${error.message}`,
          timestamp: new Date(),
        },
      ]);
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetInterview = async () => {
    setMessages([
      {
        role: 'ai',
        text: "Let's start a fresh interview session. Tell me about yourself.",
        timestamp: new Date(),
      },
    ]);
    setInput('');
    setIsTyping(false);
  };

  return (
    <div className="interview-page">
      <div className="card interview-card">
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
            <button className="btn btn-outline btn-sm" onClick={resetInterview} type="button">
              <HiOutlineArrowPath size={14} />
              New Session
            </button>
          </div>
        </div>

        <div className="interview-chat">
          {messages.map((msg, i) => (
            <div key={i} className={`chat-message ${msg.role}`}>
              {msg.role === 'ai' && (
                <div className="chat-avatar ai-avatar">
                  <RiRobot2Line size={16} />
                </div>
              )}

              <div className="chat-bubble">
                <p>{msg.text}</p>
                <span className="chat-time">
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
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
              <button className="btn-icon mic-btn" title="Voice Input" type="button">
                <HiOutlineMicrophone size={18} />
              </button>

              <button
                className="btn btn-primary send-btn"
                onClick={sendMessage}
                disabled={!input.trim() || isTyping}
                type="button"
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
