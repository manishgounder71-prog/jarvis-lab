import React, { useState, useRef, useEffect } from 'react';
import './EnhancedSciFiHUD.css';

interface Position {
    x: number;
    y: number;
}

interface EnhancedSciFiHUDProps {
    visible: boolean;
    imageSource?: string;
    mediaType?: 'image' | 'video';
}

export const EnhancedSciFiHUD: React.FC<EnhancedSciFiHUDProps> = ({ visible, imageSource, mediaType }) => {
    const [position, setPosition] = useState<Position>({ x: window.innerWidth / 2 - 400, y: 100 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
    const [scale, setScale] = useState(1);
    const [opacity, setOpacity] = useState(0.95);
    const hudRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
        // Allow dragging from anywhere on the HUD
        // Skip if clicking on interactive elements
        const target = e.target as HTMLElement;
        if (target.closest('button') || target.closest('input') || target.closest('.control-btn')) {
            return;
        }
        
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

    const handleZoomIn = () => {
        setScale(prev => Math.min(prev + 0.1, 2));
    };

    const handleZoomOut = () => {
        setScale(prev => Math.max(prev - 0.1, 0.5));
    };

    const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOpacity(parseFloat(e.target.value));
    };

    const handleReset = () => {
        setScale(1);
        setOpacity(0.95);
        setPosition({ x: window.innerWidth / 2 - 400, y: 100 });
    };

    if (!visible) return null;

    console.log('EnhancedSciFiHUD rendering with imageSource:', imageSource);

    return (
        <div 
            ref={hudRef}
            className={`enhanced-scifi-hud ${isDragging ? 'dragging' : ''}`}
            onMouseDown={handleMouseDown}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                opacity: opacity,
                transform: `scale(${scale})`,
                cursor: isDragging ? 'grabbing' : 'grab'
            }}
        >
            {/* Control Panel Header */}
            <div className="enhanced-hud-header" onMouseDown={handleMouseDown}>
                <div className="enhanced-hud-title">
                    <span className="title-icon">◉</span>
                    SCHEMATIC V3 - HUD INTERFACE
                </div>
                <div className="enhanced-hud-controls">
                    <button className="control-btn" onClick={handleReset} title="Reset">
                        ↻
                    </button>
                </div>
            </div>

            {/* Main HUD Display */}
            <div className="enhanced-hud-content">
                {/* Advanced HUD Overlay Grid */}
                <div className="hud-overlay-grid">
                    {/* Corner Brackets */}
                    <svg className="corner-overlay" viewBox="0 0 800 600">
                        {/* Top Left */}
                        <path d="M 10 50 L 10 10 L 50 10" stroke="cyan" strokeWidth="2" fill="none" />
                        {/* Top Right */}  
                        <path d="M 750 10 L 790 10 L 790 50" stroke="cyan" strokeWidth="2" fill="none" />
                        {/* Bottom Left */}
                        <path d="M 10 550 L 10 590 L 50 590" stroke="cyan" strokeWidth="2" fill="none" />
                        {/* Bottom Right */}
                        <path d="M 750 590 L 790 590 L 790 550" stroke="cyan" strokeWidth="2" fill="none" />
                        
                        {/* Grid Lines */}
                        <line x1="0" y1="300" x2="800" y2="300" stroke="rgba(0,255,255,0.1)" strokeWidth="1" />
                        <line x1="400" y1="0" x2="400" y2="600" stroke="rgba(0,255,255,0.1)" strokeWidth="1" />
                        
                        {/* Scanning Line */}
                        <line className="scan-line" x1="0" y1="0" x2="800" y2="0" stroke="cyan" strokeWidth="2" opacity="0.6" />
                        
                        {/* Corner Details */}
                        <text x="60" y="25" fill="cyan" fontSize="10" opacity="0.7">X: {position.x.toFixed(0)}</text>
                        <text x="730" y="25" fill="cyan" fontSize="10" opacity="0.7" textAnchor="end">Y: {position.y.toFixed(0)}</text>
                        <text x="60" y="585" fill="cyan" fontSize="10" opacity="0.7">ZOOM: {(scale * 100).toFixed(0)}%</text>
                        <text x="730" y="585" fill="cyan" fontSize="10" opacity="0.7" textAnchor="end">ALPHA: {(opacity * 100).toFixed(0)}%</text>
                    </svg>

                    {/* Media Display - Image or Video */}
                    {imageSource && mediaType === 'video' ? (
                        <video 
                            src={imageSource} 
                            className="hud-image-display"
                            autoPlay
                            loop
                            muted
                            playsInline
                            onLoadedData={() => console.log('HUD Video loaded successfully:', imageSource)}
                            onError={(e) => {
                                console.error('HUD Video failed to load:', imageSource);
                                console.error('Error event:', e);
                            }}
                        />
                    ) : imageSource ? (
                        <img 
                            src={imageSource} 
                            alt="HUD Schematic" 
                            className="hud-image-display"
                            draggable={false}
                            onLoad={() => console.log('HUD Image loaded successfully:', imageSource)}
                            onError={(e) => {
                                console.error('HUD Image failed to load:', imageSource);
                                console.error('Error event:', e);
                            }}
                        />
                    ) : null}

                    {/* Animated Crosshair */}
                    <div className="crosshair-overlay">
                        <div className="crosshair-h"></div>
                        <div className="crosshair-v"></div>
                    </div>
                </div>

                {/* Info Display */}
                <div className="hud-info-panel">
                    <div className="info-row">
                        <span className="info-label">STATUS:</span>
                        <span className="info-value active">ACTIVE</span>
                    </div>
                    <div className="info-row">
                        <span className="info-label">RESOLUTION:</span>
                        <span className="info-value">FULL</span>
                    </div>
                </div>
            </div>

            {/* Bottom Control Bar */}
            <div className="enhanced-hud-footer">
                <div className="footer-controls">
                    <div className="control-group">
                        <label>ZOOM</label>
                        <button className="zoom-btn" onClick={handleZoomOut}>−</button>
                        <span className="zoom-display">{(scale * 100).toFixed(0)}%</span>
                        <button className="zoom-btn" onClick={handleZoomIn}>+</button>
                    </div>

                    <div className="control-group opacity-control">
                        <label>OPACITY</label>
                        <input 
                            type="range" 
                            min="0.1" 
                            max="1" 
                            step="0.05"
                            value={opacity}
                            onChange={handleOpacityChange}
                            className="opacity-slider"
                        />
                        <span className="opacity-display">{(opacity * 100).toFixed(0)}%</span>
                    </div>

                    <div className="control-group">
                        <button className="action-btn" onClick={handleReset}>
                            RESET ALL
                        </button>
                    </div>
                </div>
            </div>

            {/* Animated Border Effect */}
            <div className="hud-border-glow"></div>
        </div>
    );
};
