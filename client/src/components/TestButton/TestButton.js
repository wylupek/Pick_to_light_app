import React from 'react';
import './TestButton.scss';

const TestButton = ({ onClick }) => {
    return (
        <button className="test-button" onClick={onClick}>
            Test
        </button>
    );
};

export default TestButton; 