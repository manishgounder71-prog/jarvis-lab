import { create } from 'zustand';

export interface PartInfo {
    name: string;
    description: string;
}

interface AppState {
    // Model state

    // Selected part
    selectedPart: PartInfo | null;
    setSelectedPart: (part: PartInfo | null) => void;


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

    // OrbitControls reference
    orbitControls: any;
    setOrbitControls: (controls: any) => void;
}

export const useAppStore = create<AppState>((set) => ({
    // Initial state
    selectedPart: null,
    highlightedPartName: null,
    isLoading: true,
    loadingProgress: 0,
    cameraControlsEnabled: true,

    // Actions

    setSelectedPart: (part) => set({ selectedPart: part }),


    setHighlightedPartName: (name) => set({ highlightedPartName: name }),

    setIsLoading: (loading) => set({ isLoading: loading }),
    setLoadingProgress: (progress) => set({ loadingProgress: progress }),

    setCameraControlsEnabled: (enabled) => set({ cameraControlsEnabled: enabled }),

    // OrbitControls
    orbitControls: null,
    setOrbitControls: (controls) => set({ orbitControls: controls }),
}));
