import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    padding: '20px',
                    color: '#ff3333',
                    background: '#110000',
                    height: '100vh',
                    fontFamily: 'monospace',
                    overflow: 'auto',
                    zIndex: 10000,
                    position: 'fixed'
                }}>
                    <h1>⚠️ SYSTEM ERROR DETECTED</h1>
                    <pre>{this.state.error?.stack}</pre>
                    <button 
                        onClick={() => window.location.reload()}
                        style={{ padding: '10px', marginTop: '20px', background: 'cyan', cursor: 'pointer' }}
                    >
                        RESTART SYSTEM
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
