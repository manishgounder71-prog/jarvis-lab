import React from 'react';
import './HologramHUD.css';

/**
 * Iron Man / JARVIS-style HUD overlay
 * Enhanced with multiple circular displays, gauges, and technical panels
 */
export const HologramHUD: React.FC = () => {
    const currentDate = new Date();
    const month = currentDate.toLocaleString('default', { month: 'long' }).toLowerCase();
    const day = currentDate.getDate();
    
    return (
        <div className="hologram-hud">
            {/* Corner brackets */}
            <div className="hud-corner hud-corner-tl"></div>
            <div className="hud-corner hud-corner-tr"></div>
            <div className="hud-corner hud-corner-bl"></div>
            <div className="hud-corner hud-corner-br"></div>
            
            {/* Scan line animation */}
            <div className="hud-scanline"></div>
            
            {/* Top status bar */}
            <div className="hud-top-bar">
                <div className="hud-status-item">
                    <span className="hud-label">STATUS</span>
                    <span className="hud-value hud-value-active">ONLINE</span>
                </div>
                <div className="hud-status-item">
                    <span className="hud-label">SIGNAL</span>
                    <span className="hud-value">98.7%</span>
                </div>
                <div className="hud-status-item">
                    <span className="hud-label">PROJECTION</span>
                    <span className="hud-value hud-value-stable">STABLE</span>
                </div>
            </div>
            
            {/* Left side - Multiple circular displays */}
            <div className="hud-left-section">
                {/* Calendar circular display */}
                <div className="hud-circular-display hud-calendar">
                    <div className="circular-border">
                        <div className="circular-content">
                            <div className="calendar-month">{month}</div>
                            <div className="calendar-day">{day}</div>
                            <div className="calendar-label">friday</div>
                        </div>
                    </div>
                </div>
                
                {/* Capacity gauge */}
                <div className="hud-circular-display hud-gauge">
                    <div className="circular-border">
                        <div className="circular-content">
                            <div className="gauge-title">Full Capacity</div>
                            <div className="gauge-value">50 <span className="gauge-unit">G</span></div>
                            <div className="gauge-subtitle">Free Capacity: 32 G</div>
                        </div>
                        <svg className="gauge-svg" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(0,255,255,0.1)" strokeWidth="2"/>
                            <circle cx="50" cy="50" r="45" fill="none" stroke="#00ffff" strokeWidth="2" 
                                    strokeDasharray="160 283" strokeLinecap="round" 
                                    transform="rotate(-90 50 50)" className="gauge-progress"/>
                        </svg>
                    </div>
                </div>
                
                {/* Power meter */}
                <div className="hud-circular-display hud-power">
                    <div className="circular-border">
                        <div className="circular-content">
                            <div className="power-percentage">62<span className="percent-sign">%</span></div>
                            <div className="power-label">Power</div>
                        </div>
                        <svg className="gauge-svg" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(0,255,255,0.1)" strokeWidth="3"/>
                            <circle cx="50" cy="50" r="40" fill="none" stroke="#00ffff" strokeWidth="3" 
                                    strokeDasharray="156 251" strokeLinecap="round" 
                                    transform="rotate(-90 50 50)" className="power-arc"/>
                        </svg>
                    </div>
                </div>
                
                {/* JARVIS logo */}
                <div className="hud-circular-display hud-jarvis-logo">
                    <div className="circular-border">
                        <div className="circular-content">
                            <div className="jarvis-text">JARVIS</div>
                            <div className="jarvis-subtitle">AI Assistant</div>
                        </div>
                        <svg className="logo-svg" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(0,255,255,0.3)" strokeWidth="1"/>
                            <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(0,255,255,0.2)" strokeWidth="1"/>
                            <circle cx="50" cy="50" r="30" fill="none" stroke="#00ffff" strokeWidth="2"/>
                        </svg>
                    </div>
                </div>
                
                {/* System status panel */}
                <div className="hud-left-panel">
                    <div className="hud-panel-title">SYSTEM</div>
                    <div className="hud-data-line">
                        <span className="hud-data-label">PWR:</span>
                        <span className="hud-data-value">100%</span>
                    </div>
                    <div className="hud-data-line">
                        <span className="hud-data-label">CPU:</span>
                        <span className="hud-data-value">43%</span>
                    </div>
                    <div className="hud-data-line">
                        <span className="hud-data-label">GPU:</span>
                        <span className="hud-data-value">67%</span>
                    </div>
                    <div className="hud-data-line">
                        <span className="hud-data-label">MEM:</span>
                        <span className="hud-data-value">2.4GB</span>
                    </div>
                </div>
            </div>
            
            {/* Right side - Arc Reactor displays and technical readouts */}
            <div className="hud-right-section">
                {/* Large Arc Reactor display */}
                <div className="hud-circular-display hud-arc-reactor-large">
                    <div className="circular-border arc-glow">
                        <div className="circular-content">
                            <div className="arc-core">
                                <div className="arc-triangle">
                                    <div className="triangle-inner"></div>
                                </div>
                            </div>
                        </div>
                        <svg className="arc-svg" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(0,255,255,0.2)" strokeWidth="0.5"/>
                            <circle cx="50" cy="50" r="45" fill="none" stroke="#00ffff" strokeWidth="1" 
                                    strokeDasharray="2 4" className="rotating-circle"/>
                            <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(0,255,255,0.4)" strokeWidth="0.5"/>
                            <circle cx="50" cy="50" r="32" fill="none" stroke="#00ffff" strokeWidth="1.5"/>
                        </svg>
                    </div>
                    <div className="arc-label">ARC REACTOR</div>
                </div>
                
                {/* Repulsor gauge */}
                <div className="hud-circular-display hud-repulsor">
                    <div className="circular-border">
                        <div className="circular-content">
                            <div className="repulsor-core"></div>
                            <div className="repulsor-label">Repulsor</div>
                        </div>
                        <svg className="gauge-svg" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(0,255,255,0.1)" strokeWidth="2"/>
                            <circle cx="50" cy="50" r="42" fill="none" stroke="#ffaa00" strokeWidth="2" 
                                    strokeDasharray="180 264" strokeLinecap="round" 
                                    transform="rotate(-90 50 50)" className="repulsor-arc"/>
                            <circle cx="50" cy="50" r="35" fill="none" stroke="rgba(255,170,0,0.2)" strokeWidth="1"/>
                        </svg>
                    </div>
                </div>
                
                {/* Technical data panels */}
                <div className="hud-right-panel hud-visual-panel">
                    <div className="hud-panel-title">VISUALS</div>
                    <div className="panel-frame"></div>
                    <div className="visual-items">
                        <div className="visual-item">▸ Weapon Data</div>
                        <div className="visual-item">▸ Flight Systems</div>
                        <div className="visual-item">▸ Energy Grid</div>
                        <div className="visual-item">▸ Diagnostics</div>
                    </div>
                </div>
                
                {/* Coordinates */}
                <div className="hud-right-panel">
                    <div className="hud-panel-title">COORDINATES</div>
                    <div className="hud-data-line">
                        <span className="hud-data-label">X:</span>
                        <span className="hud-data-value hud-glitch">000.00</span>
                    </div>
                    <div className="hud-data-line">
                        <span className="hud-data-label">Y:</span>
                        <span className="hud-data-value hud-glitch">000.00</span>
                    </div>
                    <div className="hud-data-line">
                        <span className="hud-data-label">Z:</span>
                        <span className="hud-data-value">000.00</span>
                    </div>
                </div>
            </div>
            
            {/* Bottom status */}
            <div className="hud-bottom-bar">
                <div className="hud-timestamp">{currentDate.toISOString().slice(0,10)} | {currentDate.toLocaleTimeString()}</div>
                <div className="hud-system-name">J.A.R.V.I.S. HOLOGRAPHIC INTERFACE v4.2</div>
            </div>
            
            {/* Circular targeting reticle */}
            <div className="hud-reticle">
                <div className="hud-reticle-ring"></div>
                <div className="hud-reticle-cross"></div>
            </div>
        </div>
    );
};
