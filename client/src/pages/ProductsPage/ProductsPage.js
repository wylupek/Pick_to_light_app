import React, { useEffect, useState } from 'react';
import './ProductsPage.scss';
import ProductsList from '../../components/ProductsList/ProductsList';
import SearchBar from '../../components/SearchBar/SearchBar';
import DeliverButton from '../../components/DeliverButton/DeliverButton';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import config from '../../config';

const ProductsPage = () => {
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

                const storedSelectedProducts = JSON.parse(sessionStorage.getItem('selectedProducts')) || [];
                const matchedProducts = fetchedProducts.filter(product =>
                    storedSelectedProducts.some(storedProduct => storedProduct.ean === product.ean)
                );
                const newProducts = storedSelectedProducts.filter(storedProduct =>
                    !matchedProducts.some(matchedProduct => matchedProduct.ean === storedProduct.ean)
                );
                setSelectedProducts([...matchedProducts, ...newProducts]);
            })
            .catch(err => console.error(err));
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

            sessionStorage.setItem('selectedProducts', JSON.stringify(updatedSelectedProducts));
        }
    };

    const handleDeliverButtonClick = () => {
        navigate('/selected-products');
    };

    return (
        <div className="ProductsPage">
            <header className="header">
                <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            </header>
            {filteredProducts.length === 0 ? (
                <>
                    <p className="p">No products available for this supplier</p>
                </>
            ) : (
                <>
                    <ProductsList
                        products={filteredProducts}
                        selectedProducts={selectedProducts}
                        onRowClick={toggleSelectProduct}
                    />
                </>
            )}
            <DeliverButton onClick={handleDeliverButtonClick}>
                Deliver
            </DeliverButton>
        </div>
    );
};

export default ProductsPage;
