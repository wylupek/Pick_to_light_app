import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BackButton.scss';

const BackButton = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1); // This will navigate back to the previous page
    };

    return (
        <button className="back-button" onClick={handleBack}>
            WRÓĆ
        </button>
    );
}

export default BackButton;
