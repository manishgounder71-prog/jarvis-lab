import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import './PartInfo.css';

export const PartInfo: React.FC = () => {
    const { selectedPart } = useAppStore();

    if (!selectedPart) return null;

    return (
        <div className="part-info glass">
            <div className="part-info-header">
                <h3>{selectedPart.name}</h3>
            </div>
            <div className="part-info-body">
                <p>{selectedPart.description}</p>
            </div>
        </div>
    );
};
