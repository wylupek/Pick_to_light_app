import React from 'react';
import ListItem from '../ListItem/ListItem';
import './DisplayList.scss';
import { ReactComponent as UnselectIcon } from '../../assets/delete.svg';

const DisplayList = ({ products, productToDisplay, toggleSelectProduct, unselectProduct }) => {
    return (
        <div className="displayList">
            {products.map(product => (
                <ListItem
                    key={product.ean}
                    product={product}
                    isSelected={productToDisplay && productToDisplay.id === product.id}
                    onSelect={toggleSelectProduct}
                    onUnselect={unselectProduct}
                    showUnselectIcon={true}
                    UnselectIcon={UnselectIcon}
                />
            ))}
        </div>
    );
};

export default DisplayList;
