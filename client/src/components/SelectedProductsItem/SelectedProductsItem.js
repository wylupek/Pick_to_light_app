import React from 'react';
import './SelectedProductsItem.scss';
import { ReactComponent as UnselectIcon } from '../../assets/delete.svg';

const SelectedProductsItem = ({ product, onSelect, onUnselect, isSelected }) => {
    return (
        <div className={`selectedProductsItem ${isSelected ? 'selected' : ''}`}
            onClick={() => onSelect(product)}
        >
            <UnselectIcon alt="Unselect"
                className="unselectIcon"
                onClick={(e) => {
                    e.stopPropagation();
                    onUnselect(product.id);
                }}
            />

            <div className="productInfo">
                <div className="productEan">{product.ean}</div>
                <div className="productName">{product.product_name}</div>
            </div>
        </div>
    );
};

export default SelectedProductsItem;
