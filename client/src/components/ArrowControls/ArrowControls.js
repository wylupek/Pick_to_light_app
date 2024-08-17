import React from 'react';
import './ArrowControls.scss';
import { ReactComponent as LeftArrowIcon } from '../../assets/left_arrow.svg';
import { ReactComponent as RightArrowIcon } from '../../assets/right_arrow.svg';

const ArrowControls = ({ onIncrement, onDecrement }) => {
    return (
        <div className="arrow-controls">
            <LeftArrowIcon className="arrow left" onClick={onDecrement} />
            <RightArrowIcon className="arrow right" onClick={onIncrement} />
        </div>
    );
}

export default ArrowControls;
