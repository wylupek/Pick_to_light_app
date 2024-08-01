import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ProductsTable.scss';
import SearchBar from '../SearchBar/SearchBar';

const ProductsTable = () => {
    const { id } = useParams();
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        axios.post('http://192.168.1.100:8080/api/productsBySupplierId', { id })
            .then(response => {
                setProducts(response.data);
            })
            .catch(err => {
                console.error(err);
            });
    }, [id]);

    const filteredProducts = products.filter(product =>
        product.ean.toString().includes(searchQuery) ||
        product.product_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const deleteProduct = (id) => {
        console.log("Delete", id);
        // Implement your delete logic here
    };

    const displayProduct = (id) => {
        console.log("Display", id);
        // Implement your display logic here
    };

    if (filteredProducts.length === 0) {
        return (
            <>
                <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                <p>No products available for this supplier</p>
            </>
        );
    }

    return (
        <>
            <header className="header">
                <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
            </header>
            <table className='productTable'>
                <tbody>
                {filteredProducts.map(product => (
                    <tr key={product.ean}>
                        <td className="deleteCell" onClick={() => deleteProduct(product.id)}>
                            Delete
                        </td>
                        <td>{product.ean}</td>
                        <td>{product.product_name}</td>
                        <td className="displayCell" onClick={() => displayProduct(product.id)}>
                            Display
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    );
}

export default ProductsTable;
