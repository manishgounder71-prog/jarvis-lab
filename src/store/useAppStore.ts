import { create } from 'zustand';

export interface PartInfo {
    name: string;
    description: string;
}

interface AppState {
    // Model state
    isExploded: boolean;
    setIsExploded: (exploded: boolean) => void;
    toggleExploded: () => void;

    // Selected part
    selectedPart: PartInfo | null;
    setSelectedPart: (part: PartInfo | null) => void;

    // Gesture control
    gestureEnabled: boolean;
    setGestureEnabled: (enabled: boolean) => void;
    toggleGestureEnabled: () => void;

    // Highlighted part (for hover)
    highlightedPartName: string | null;
    setHighlightedPartName: (name: string | null) => void;

    // Loading state
    isLoading: boolean;
    loadingProgress: number;
    setIsLoading: (loading: boolean) => void;
    setLoadingProgress: (progress: number) => void;

    // Camera control
    cameraControlsEnabled: boolean;
    setCameraControlsEnabled: (enabled: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
    // Initial state
    isExploded: false,
    selectedPart: null,
    gestureEnabled: false,
    highlightedPartName: null,
    isLoading: true,
    loadingProgress: 0,
    cameraControlsEnabled: true,

    // Actions
    setIsExploded: (exploded) => set({ isExploded: exploded }),
    toggleExploded: () => set((state) => ({ isExploded: !state.isExploded })),

    setSelectedPart: (part) => set({ selectedPart: part }),

    setGestureEnabled: (enabled) => set({ gestureEnabled: enabled }),
    toggleGestureEnabled: () => set((state) => ({ gestureEnabled: !state.gestureEnabled })),

    setHighlightedPartName: (name) => set({ highlightedPartName: name }),

    setIsLoading: (loading) => set({ isLoading: loading }),
    setLoadingProgress: (progress) => set({ loadingProgress: progress }),

    setCameraControlsEnabled: (enabled) => set({ cameraControlsEnabled: enabled }),
}));
