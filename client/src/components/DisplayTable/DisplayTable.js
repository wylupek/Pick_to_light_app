import React from 'react';
import DisplayItem from '../DisplayItem/DisplayItem';
import './DisplayTable.scss';

const DisplayTable = ({ products, productToDisplay, toggleSelectProduct, unselectProduct }) => {
    return (
        <div className="selectedProductsList">
            {products.map(product => (
                <DisplayItem
                    key={product.ean}
                    product={product}
                    isSelected={productToDisplay && productToDisplay.id === product.id}
                    onSelect={toggleSelectProduct}
                    onUnselect={unselectProduct}
                />
            ))}
        </div>
    );
};

export default DisplayTable;
