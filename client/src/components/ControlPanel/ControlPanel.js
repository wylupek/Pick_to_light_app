import React, { useState } from 'react';
import BackButton from '../BackButton/BackButton';
import ValueDisplay from '../ValueDisplay/ValueDisplay';
import ArrowControls from '../ArrowControls/ArrowControls';
import './ControlPanel.scss';

const ControlPanel = () => {
    const [value, setValue] = useState(0);

    const handleIncrement = () => {
        setValue(value + 1);
    }

    const handleDecrement = () => {
        setValue(value - 1);
    }

    return (
        <div className="control-panel">
            <BackButton />
            <ValueDisplay value={value} />
            <ArrowControls onIncrement={handleIncrement} onDecrement={handleDecrement} />
        </div>
    );
}

export default ControlPanel;
