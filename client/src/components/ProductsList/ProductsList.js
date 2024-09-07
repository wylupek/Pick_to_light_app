import React from 'react';
import './ProductsList.scss';

const ProductsList = ({ products, selectedProducts, onRowClick }) => {
    return (
        <table className='productTable'>
            <tbody>
            {products.map(product => (
                <tr
                    key={product.ean}
                    className={selectedProducts.includes(product) ? 'selectedRow' : ''}
                    onClick={() => onRowClick(product)}
                >
                    <td>{product.ean}</td>
                    <td>{product.product_name}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default ProductsList;
