import React from 'react';
import './ValueDisplay.scss';

const ValueDisplay = ({ value }) => {
    return (
        <div className="value-display">
            {value}
        </div>
    );
}

export default ValueDisplay;
