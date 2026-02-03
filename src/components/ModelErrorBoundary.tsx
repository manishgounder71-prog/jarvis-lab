import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Html } from '@react-three/drei';

interface Props {
    children: ReactNode;
    onError?: (error: Error) => void;
    embedUrl?: string;
    onReset?: () => void;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ModelErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Model loading error:', error);
        if (this.props.onError) {
            this.props.onError(error);
        }
    }

    public componentDidUpdate(prevProps: Props) {
        // Reset error state if children change (e.g., trying a different model)
        if (prevProps.children !== this.props.children && this.state.hasError) {
            this.setState({ hasError: false, error: null });
        }
    }

    public render() {
        if (this.state.hasError) {
            if (this.props.embedUrl) {
                return (
                    <group>
                        <Html position={[0, 0, 0]} fullscreen style={{ pointerEvents: 'none' }}>
                             <div style={{
                                width: '100vw',
                                height: '100vh',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                zIndex: -1, // Push behind UI
                                pointerEvents: 'all' // Enable Interaction
                            }}>
                                <iframe 
                                    title="Remote Model Stream" 
                                    width="100%" 
                                    height="100%" 
                                    src={`${this.props.embedUrl}?autostart=1&ui_theme=dark&dnt=1`}
                                    frameBorder="0" 
                                    allow="autoplay; fullscreen; xr-spatial-tracking" 
                                    style={{ border: 'none' }}
                                ></iframe>
                                
                                <div style={{
                                    position: 'absolute',
                                    bottom: '20px',
                                    right: '20px',
                                    padding: '5px 10px',
                                    background: 'rgba(0,0,0,0.5)',
                                    color: 'rgba(0, 255, 255, 0.5)',
                                    fontFamily: 'Orbitron',
                                    fontSize: '10px',
                                    pointerEvents: 'none'
                                }}>
                                    📡 LIVE REMOTE FEED
                                </div>
                                
                                <button 
                                    onClick={() => this.props.onReset?.()}
                                    style={{
                                        position: 'absolute',
                                        top: '20px',
                                        right: '20px',
                                        background: 'rgba(0, 50, 50, 0.8)',
                                        border: '1px solid cyan',
                                        color: 'cyan',
                                        padding: '10px 20px',
                                        fontFamily: 'Orbitron',
                                        fontSize: '14px',
                                        cursor: 'pointer',
                                        pointerEvents: 'all',
                                        zIndex: 1000,
                                        boxShadow: '0 0 10px cyan'
                                    }}
                                >
                                    ❌ CLOSE CONNECTION
                                </button>
                            </div>
                        </Html>
                    </group>
                );
            }

            return (
                <group>
                    <mesh>
                        <boxGeometry args={[1, 1, 1]} />
                        <meshBasicMaterial color="red" wireframe />
                    </mesh>
                    <Html position={[0, 1.2, 0]} center>
                        <div style={{
                            color: '#ff3333',
                            background: 'rgba(20, 0, 0, 0.9)',
                            padding: '10px',
                            border: '1px solid red',
                            borderRadius: '5px',
                            fontFamily: 'Orbitron',
                            textAlign: 'center',
                            whiteSpace: 'nowrap'
                        }}>
                            ⚠️ MODEL FILE NOT FOUND<br/>
                            <span style={{fontSize: '0.8em', color: '#aaaaaa'}}>
                                Please download the .glb file
                            </span>
                        </div>
                    </Html>
                </group>
            );
        }

        return this.props.children;
    }
}
