import React from 'react';
import './DeliverButton.scss';

const DeliverButton = ({ onClick, children }) => {
    return (
        <button className="deliver-button" onClick={onClick}>
            {children}
        </button>
    );
};

export default DeliverButton;
