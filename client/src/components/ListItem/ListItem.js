import React from 'react';
import './ListItem.scss';

const ListItem = ({ product, onSelect, isSelected, showUnselectIcon, UnselectIcon, onUnselect }) => {
    return (
        <div
            className={`listItem ${isSelected ? 'selected' : ''} ${showUnselectIcon ? 'withIcon' : 'withoutIcon'}`}
            onClick={() => onSelect(product)}
        >
            {showUnselectIcon && UnselectIcon && (
                <UnselectIcon
                    alt="Unselect"
                    className="unselectIcon"
                    onClick={(e) => {
                        e.stopPropagation();
                        onUnselect(product.id);
                    }}
                />
            )}
            <div className="productInfo">
                <div className="productEan">{product.ean}</div>
                <div className="productName">{product.product_name}</div>
            </div>
        </div>
    );
};

export default ListItem;
