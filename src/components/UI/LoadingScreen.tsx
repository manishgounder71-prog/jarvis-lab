import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import './LoadingScreen.css';

export const LoadingScreen: React.FC = () => {
    const { isLoading, loadingProgress, setIsLoading } = useAppStore();
    const [debugMode, setDebugMode] = useState(false);

    return (
        <div className={`loading-screen ${!isLoading ? 'hidden' : ''}`}>
            <div className="loading-spinner"></div>
            <div className="loading-text">INITIALIZING HOLOGRAM</div>
            <div className="loading-progress">
                <div
                    className="loading-progress-bar"
                    style={{ width: `${loadingProgress}%` }}
                ></div>
            </div>
            <div className="loading-percentage">{Math.round(loadingProgress)}%</div>
            
            {/* Debug skip button for blank screen issue */}
            <button 
                onClick={() => setIsLoading(false)}
                onMouseEnter={() => setDebugMode(true)}
                onMouseLeave={() => setDebugMode(false)}
                style={{
                    marginTop: '40px',
                    background: 'transparent',
                    border: '1px solid rgba(0, 255, 255, 0.3)',
                    color: 'rgba(0, 255, 255, 0.5)',
                    padding: '8px 15px',
                    cursor: 'pointer',
                    fontSize: '10px',
                    fontFamily: 'Orbitron',
                    opacity: debugMode ? 1 : 0.2,
                    transition: 'opacity 0.3s'
                }}
            >
                SKIP INITIALIZATION (DEBUG)
            </button>
        </div>
    );
};
