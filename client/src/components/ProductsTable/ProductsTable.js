import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProductsTable.scss';
import SearchBar from '../SearchBar/SearchBar';
import config from '../../config';
import DeliverButton from '../DeliverButton/DeliverButton';

const ProductsTable = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [lastClickTimes, setLastClickTimes] = useState({});

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
        const currentTime = Date.now();
        const lastClickTime = lastClickTimes[product.ean] || 0;

        if (currentTime - lastClickTime >= 500) {
            if (selectedProducts.includes(product)) {
                setSelectedProducts(selectedProducts.filter(p => p !== product));
            } else {
                setSelectedProducts([...selectedProducts, product]);
            }
            setLastClickTimes({
                ...lastClickTimes,
                [product.ean]: currentTime
            });
        }
    };

    const handleDeliverButtonClick = () => {
        navigate('/selected-products', { state: { selectedProducts } });
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
