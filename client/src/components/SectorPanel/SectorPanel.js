import React, { useState, useEffect } from 'react';
import './SectorPanel.scss';

const SectorPanel = ({ value, onChange }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(value.toString());

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    const handleInputChange = (e) => {
        const newValue = e.target.value;
        if (newValue === '' || /^\d{1,3}$/.test(newValue)) {
            setInputValue(newValue);
        }
    };

    const handleBlur = () => {
        if (inputValue === '') {
            setInputValue(value);
        } else {
            onChange(Number(inputValue));
        }
        setIsEditing(false);
    };

    const handleFocus = () => {
        setIsEditing(true);
        setInputValue('');
    };

    return (
        <div
            className={`sector-display ${isEditing ? 'editing' : ''}`}
            onClick={handleFocus}
        >
            {isEditing ? (
                <input
                    type="tel"
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    autoFocus
                    placeholder={value}
                />
            ) : (
                <span className="display-sector">{value}</span>
            )}
        </div>
    );
};

export default SectorPanel;
