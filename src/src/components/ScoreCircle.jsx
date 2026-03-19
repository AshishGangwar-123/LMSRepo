function ScoreCircle({ value = 0, size = 120, strokeWidth = 8 }) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = (value / 100) * circumference;
    const offset = circumference - progress;

    const getColor = (v) => {
        if (v >= 80) return '#22c55e';
        if (v >= 60) return '#4a6cf7';
        if (v >= 40) return '#f59e0b';
        return '#ef4444';
    };

    return (
        <div className="score-circle" style={{ width: size, height: size }}>
            <svg width={size} height={size}>
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth={strokeWidth}
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={getColor(value)}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    style={{ transition: 'stroke-dashoffset 1.2s ease-out' }}
                />
            </svg>
            <span className="score-circle-value" style={{ color: getColor(value), fontSize: size * 0.24 }}>
                {value}%
            </span>
        </div>
    );
}

export default ScoreCircle;
