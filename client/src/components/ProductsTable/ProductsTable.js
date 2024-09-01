import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './ProductsTable.scss';
import SearchBar from '../SearchBar/SearchBar';
import config from '../../config';
import DeliverButton from '../DeliverButton/DeliverButton';

const ProductsTable = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [lastClickTimes, setLastClickTimes] = useState({});

    useEffect(() => {
        axios.post(`${config.server.url}/api/productsBySupplierId`, { id })
            .then(response => {
                const fetchedProducts = response.data;
                setProducts(fetchedProducts);

                // Copy specific object to apply highlight or proper selecting
                const storedSelectedProducts = JSON.parse(sessionStorage.getItem('selectedProducts')) || [];
                const matchedProducts = fetchedProducts.filter(product =>
                    storedSelectedProducts.some(storedProduct => storedProduct.ean === product.ean)
                );
                const newProducts = storedSelectedProducts.filter(storedProduct =>
                    !matchedProducts.some(matchedProduct => matchedProduct.ean === storedProduct.ean)
                );
                const updatedMatchedProducts = [...matchedProducts, ...newProducts];

                setSelectedProducts(updatedMatchedProducts);
            })
            .catch(err => {
                console.error(err);
            });
    }, [id]);

    useEffect(() => {
        if (location.state?.searchQuery) {
            setSearchQuery(location.state.searchQuery);
        }
    }, [location.state]);

    const filteredProducts = products.filter(product =>
        product.ean.toString().includes(searchQuery) ||
        product.product_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleSelectProduct = (product) => {
        const currentTime = Date.now();
        const lastClickTime = lastClickTimes[product.ean] || 0;

        if (currentTime - lastClickTime >= 500) {
            let updatedSelectedProducts;

            if (selectedProducts.includes(product)) {
                updatedSelectedProducts = selectedProducts.filter(p => p !== product);
            } else {
                updatedSelectedProducts = [...selectedProducts, product];
            }

            setSelectedProducts(updatedSelectedProducts);
            setLastClickTimes({
                ...lastClickTimes,
                [product.ean]: currentTime
            });

            // Save updated selected products to sessionStorage
            sessionStorage.setItem('selectedProducts', JSON.stringify(updatedSelectedProducts));
        }
    };

    const handleDeliverButtonClick = () => {
        navigate('/selected-products', { state: { selectedProducts } });
    };

    if (filteredProducts.length === 0) {
        return (
            <>
                <header className="header">
                    <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
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
                <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
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
};

export default ProductsTable;
