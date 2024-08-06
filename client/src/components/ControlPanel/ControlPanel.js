import React from 'react';
import BackButton from '../BackButton/BackButton';
import ValueDisplay from '../ValueDisplay/ValueDisplay';
import ArrowControls from '../ArrowControls/ArrowControls';
import './ControlPanel.scss';

const ControlPanel = ({ sector, setSector }) => {
    const handleIncrement = () => {
        setSector(sector + 1);
    }

    const handleDecrement = () => {
        setSector(sector - 1);
    }

    return (
        <div className="control-panel">
            <BackButton />
            <ValueDisplay value={sector} />
            <ArrowControls onIncrement={handleIncrement} onDecrement={handleDecrement} />
        </div>
    );
}

export default ControlPanel;
