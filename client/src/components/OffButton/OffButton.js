import React from 'react';
import './OffButton.scss';

const OffButton = ({ onClick }) => {
    return (
        <button className="off-button" onClick={onClick}>
            Off
        </button>
    );
};

export default OffButton; 