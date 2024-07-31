import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ProductsTable.scss';

const ProductsTable = () => {
    const { id } = useParams();
    const [products, setProducts] = useState([]);


    useEffect(() => {
        axios.post('http://192.168.1.100:8080/api/productsBySupplierId', { id })
            .then(response => {
                setProducts(response.data);
            })
            .catch(err => {
                console.error(err);
            });
    }, [id]);

    if (products.length === 0) {
        return <p>No products available for this supplier</p>;
    }
    // console.log(values);

    return (

            <table className='productTable'>
                <thead>
                <tr>
                    <th>EAN</th>
                    <th>Name</th>
                </tr>
                </thead>
                <tbody>
                {products.map(product => (
                    <tr key={product.ean}>
                        <td>{product.ean}</td>
                        <td>{product.product_name}</td>
                    </tr>
                ))}
                </tbody>
            </table>

    );
}

export default ProductsTable;
