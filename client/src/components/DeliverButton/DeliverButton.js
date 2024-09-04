import React from 'react';
import './DeliverButton.scss';

const DeliverButton = ({ onClick, children }) => {
    return (
        <div className="deliver-div">
            <button className="deliver-button" onClick={onClick}>
                {children}
            </button>
        </div>
    );
};

export default DeliverButton;
