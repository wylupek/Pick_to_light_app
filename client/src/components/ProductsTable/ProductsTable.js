import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import './ProductsTable.scss';
import SearchBar from '../SearchBar/SearchBar';
import ControlPanel from '../ControlPanel/ControlPanel';
import config from '../../config';
import DeliverButton from '../DeliverButton/DeliverButton';

const ProductsTable = () => {
    const { id } = useParams();
    const navigate = useNavigate(); // Initialize useNavigate
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sector, setSector] = useState(1);
    const [selectedProducts, setSelectedProducts] = useState([]);

    useEffect(() => {
        axios.post(`${config.server.url}/api/productsBySupplierId`, { id })
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

    const toggleSelectProduct = (product) => {
        if (selectedProducts.includes(product)) {
            setSelectedProducts(selectedProducts.filter(p => p !== product));
        } else {
            setSelectedProducts([...selectedProducts, product]);
        }
    };

    const handleDeliverButtonClick = () => {
        navigate('/selected-products', { state: { selectedProducts } }); // Navigate to next page with selectedProducts
    };

    if (filteredProducts.length === 0) {
        return (
            <>
                <header className="header">
                    <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
                    <p>No products available for this supplier</p>
                </header>
                <DeliverButton onClick={handleDeliverButtonClick}>
                    Deliver
                </DeliverButton>
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
                    <tr
                        key={product.ean}
                        className={selectedProducts.includes(product) ? 'selectedRow' : ''}
                        onClick={() => toggleSelectProduct(product)}
                    >
                        <td>{product.ean}</td>
                        <td>{product.product_name}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <DeliverButton onClick={handleDeliverButtonClick}>
                Deliver
            </DeliverButton>
        </>
    );
}

export default ProductsTable;
