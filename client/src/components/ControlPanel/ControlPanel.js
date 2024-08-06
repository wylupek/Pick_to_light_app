import React from 'react';
import BackButton from '../BackButton/BackButton';
import SectorPanel from '../SectorPanel/SectorPanel';
import ArrowControls from '../ArrowControls/ArrowControls';
import './ControlPanel.scss';

const ControlPanel = ({ sector, setSector }) => {
    const handleIncrement = () => {
        if(sector !== 999) {
            setSector(sector + 1);
        }
    }

    const handleDecrement = () => {
        if(sector !== 0) {
            setSector(sector - 1);
        }
    }

    const handleSectorChange = (newSector) => {
        if (newSector >= 0 && newSector <= 999) {
            setSector(newSector);
        }
    }

    return (
        <div className="control-panel">
            <BackButton />
            <SectorPanel value={sector} onChange={handleSectorChange} />
            <ArrowControls onIncrement={handleIncrement} onDecrement={handleDecrement} />
        </div>
    );
}

export default ControlPanel;
