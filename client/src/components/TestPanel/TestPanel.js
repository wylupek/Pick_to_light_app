import React from 'react';
import TestButton from '../TestButton/TestButton';
import OffButton from '../OffButton/OffButton';
import './TestPanel.scss';

const TestPanel = ({ onTestClick, onOffClick }) => {
    return (
        <div className="test-panel">
            <TestButton onClick={onTestClick} />
            <OffButton onClick={onOffClick} />
        </div>
    );
};

export default TestPanel; 