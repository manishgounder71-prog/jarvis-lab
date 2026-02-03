import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import './ControlPanel.css';

export const ControlPanel: React.FC = () => {
    const {
        isExploded,
        toggleExploded,
        gestureEnabled,
        toggleGestureEnabled
    } = useAppStore();

    const [showGuide, setShowGuide] = useState(false);

    return (
        <div className="control-panel glass">
            <h2 className="control-title">CONTROLS</h2>

            <div className="control-buttons">
                <button
                    className={`control-btn ${gestureEnabled ? 'active' : ''}`}
                    onClick={toggleGestureEnabled}
                >
                    <span className="btn-icon">✋</span>
                    <span className="btn-label">
                        {gestureEnabled ? 'Gesture: ON' : 'Gesture: OFF'}
                    </span>
                </button>

                <button
                    className="control-btn"
                    onClick={toggleExploded}
                >
                    <span className="btn-icon">{isExploded ? '🔄' : '💥'}</span>
                    <span className="btn-label">
                        {isExploded ? 'Assemble' : 'Explode'}
                    </span>
                </button>

                <button
                    className="control-btn"
                    onClick={() => setShowGuide(!showGuide)}
                >
                    <span className="btn-icon">❓</span>
                    <span className="btn-label">Guide</span>
                </button>
            </div>

            {showGuide && (
                <div className="gesture-guide">
                    <h3>Gesture Guide</h3>
                    <ul>
                        <li><strong>✌️ Two Fingers Spread:</strong> Zoom In</li>
                        <li><strong>🤏 Two Fingers Pinch:</strong> Zoom Out</li>
                        <li><strong>✋ Open Hand:</strong> Explode Model</li>
                        <li><strong>✊ Closed Fist:</strong> Assemble Model</li>
                        <li><strong>👉 Swipe Horizontal:</strong> Rotate Model</li>
                    </ul>
                    <p className="guide-note">
                        Enable webcam permission for gesture controls
                    </p>
                </div>
            )}
        </div>
    );
};
