import React from 'react';
import './ArrowControls.scss';

const ArrowControls = ({ onIncrement, onDecrement }) => {
    return (
        <div className="arrow-controls">
            <div className="arrow left" onClick={onDecrement}>
                &lt;
            </div>
            <div className="arrow right" onClick={onIncrement}>
                &gt;
            </div>
        </div>
    );
}

export default ArrowControls;
