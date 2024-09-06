import React, { useState } from 'react';
import './DeliverButton.scss';

const DeliverButton = ({ onClick, children }) => {
    const [isClicked, setIsClicked] = useState(false);

    const handleClick = () => {
        setIsClicked(true);

        if (onClick) {
            onClick();
        }

        setTimeout(() => {
            setIsClicked(false);
        }, 1500);
    };

    return (
        <div className="deliver-div">
            <button
                className={`deliver-button ${isClicked ? 'clicked' : ''}`}
                onClick={handleClick}
            >
                {children}
            </button>
        </div>
    );
};

export default DeliverButton;
