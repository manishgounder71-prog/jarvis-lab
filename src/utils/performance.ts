// Throttle function to limit execution rate
export function throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return function (this: any, ...args: Parameters<T>) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

// Debounce function to delay execution
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number
): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout;
    return function (this: any, ...args: Parameters<T>) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// FPS monitor class
export class FPSMonitor {
    private frames: number = 0;
    private lastTime: number = performance.now();
    private fps: number = 0;

    update(): number {
        this.frames++;
        const currentTime = performance.now();
        const delta = currentTime - this.lastTime;

        if (delta >= 1000) {
            this.fps = Math.round((this.frames * 1000) / delta);
            this.frames = 0;
            this.lastTime = currentTime;
        }

        return this.fps;
    }

    getFPS(): number {
        return this.fps;
    }
}

// Clamp value between min and max
export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

// Linear interpolation
export function lerp(start: number, end: number, t: number): number {
    return start + (end - start) * t;
}
