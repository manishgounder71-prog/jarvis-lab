import React, { useState, useRef, useEffect } from 'react';
import './SciFiHUD.css';

interface Position {
    x: number;
    y: number;
}

export const SciFiHUD: React.FC<{ visible: boolean }> = ({ visible }) => {
    const [position, setPosition] = useState<Position>({ x: 100, y: 100 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
    const hudRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (hudRef.current) {
            const rect = hudRef.current.getBoundingClientRect();
            setDragOffset({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            });
            setIsDragging(true);
        }
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                setPosition({
                    x: e.clientX - dragOffset.x,
                    y: e.clientY - dragOffset.y
                });
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, dragOffset]);

    if (!visible) return null;

    return (
        <div 
            ref={hudRef}
            className={`scifi-hud ${isDragging ? 'dragging' : ''}`}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                cursor: isDragging ? 'grabbing' : 'grab'
            }}
            onMouseDown={handleMouseDown}
        >
            {/* Main HUD Container */}
            <div className="hud-container">
                {/* Header */}
                <div className="hud-header">
                    <div className="hud-title">TACTICAL INTERFACE</div>
                    <div className="hud-status">ONLINE</div>
                </div>

                {/* Main Display Grid */}
                <div className="hud-grid">
                    {/* Left Column - Circular Displays */}
                    <div className="hud-column">
                        <div className="circular-display">
                            <svg viewBox="0 0 100 100" className="circle-svg">
                                <circle cx="50" cy="50" r="45" className="circle-bg" />
                                <circle cx="50" cy="50" r="45" className="circle-progress" 
                                    style={{ strokeDasharray: '283', strokeDashoffset: '70' }} />
                                <text x="50" y="50" className="circle-text">75%</text>
                            </svg>
                            <div className="display-label">POWER</div>
                        </div>

                        <div className="circular-display">
                            <svg viewBox="0 0 100 100" className="circle-svg">
                                <circle cx="50" cy="50" r="45" className="circle-bg" />
                                <circle cx="50" cy="50" r="45" className="circle-progress-alt" 
                                    style={{ strokeDasharray: '283', strokeDashoffset: '113' }} />
                                <text x="50" y="50" className="circle-text">60%</text>
                            </svg>
                            <div className="display-label">SHIELD</div>
                        </div>
                    </div>

                    {/* Center Column - Data Readouts */}
                    <div className="hud-column center-column">
                        <div className="data-row">
                            <span className="data-label">CORE TEMP</span>
                            <span className="data-value">2547°K</span>
                        </div>
                        <div className="data-row">
                            <span className="data-label">VELOCITY</span>
                            <span className="data-value">1.2 KM/S</span>
                        </div>
                        <div className="data-row">
                            <span className="data-label">ALTITUDE</span>
                            <span className="data-value">15,420 M</span>
                        </div>
                        <div className="data-row">
                            <span className="data-label">LATITUDE</span>
                            <span className="data-value">40.7128°N</span>
                        </div>
                        <div className="data-row">
                            <span className="data-label">LONGITUDE</span>
                            <span className="data-value">74.0060°W</span>
                        </div>
                    </div>

                    {/* Right Column - Mini Radar */}
                    <div className="hud-column">
                        <div className="radar-display">
                            <svg viewBox="0 0 100 100" className="radar-svg">
                                <circle cx="50" cy="50" r="40" className="radar-ring" />
                                <circle cx="50" cy="50" r="30" className="radar-ring" />
                                <circle cx="50" cy="50" r="20" className="radar-ring" />
                                <circle cx="50" cy="50" r="10" className="radar-ring" />
                                <line x1="50" y1="10" x2="50" y2="90" className="radar-line" />
                                <line x1="10" y1="50" x2="90" y2="50" className="radar-line" />
                                <line className="radar-sweep" x1="50" y1="50" x2="50" y2="10" />
                                <circle cx="65" cy="35" r="2" className="radar-blip" />
                                <circle cx="40" cy="60" r="2" className="radar-blip" />
                            </svg>
                            <div className="display-label">PROXIMITY</div>
                        </div>
                    </div>
                </div>

                {/* Bottom Status Bar */}
                <div className="hud-footer">
                    <div className="status-bar">
                        <div className="status-item">
                            <div className="status-dot active"></div>
                            <span>SYSTEMS</span>
                        </div>
                        <div className="status-item">
                            <div className="status-dot active"></div>
                            <span>COMMS</span>
                        </div>
                        <div className="status-item">
                            <div className="status-dot"></div>
                            <span>WEAPONS</span>
                        </div>
                    </div>
                </div>

                {/* Scanline Effect */}
                <div className="scanline"></div>
            </div>
        </div>
    );
};
