import React from 'react';
import './DeliverButton.scss';

const DeliverButton = ({ onClick, children, isClicked }) => {
    return (
        <div className="deliver-div">
            <button
                className={`deliver-button ${isClicked ? 'clicked' : ''}`}
                onClick={onClick}
            >
                {children}
            </button>
        </div>
    );
};

export default DeliverButton;
