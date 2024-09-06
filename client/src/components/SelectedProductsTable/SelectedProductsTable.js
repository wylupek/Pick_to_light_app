import React, { useState, useEffect } from 'react';
import './SelectedProductsTable.scss';
import ControlPanel from "../ControlPanel/ControlPanel";
import SearchBar from "../SearchBar/SearchBar";
import axios from "axios";
import config from "../../config";
import DeliverButton from '../DeliverButton/DeliverButton';
import SelectedProductsItem from '../SelectedProductsItem/SelectedProductsItem';

const SelectedProductsTable = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [sector, setSector] = useState(1);
    const [productToDisplay, setProductToDisplay] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState([]);

    useEffect(() => {
        const storedSelectedProducts = JSON.parse(sessionStorage.getItem('selectedProducts')) || [];
        setSelectedProducts(storedSelectedProducts);
    }, []);

    const unselect = (productId) => {
        const updatedProducts = selectedProducts.filter(product => product.id !== productId);
        setSelectedProducts(updatedProducts);
        sessionStorage.setItem('selectedProducts', JSON.stringify(updatedProducts));
    };

    const displayProduct = (productId) => {
        axios.post(`${config.server.url}/api/displaySector`, {
            json: {
                productId: productId,
                sector: sector
            }
        })
            .then(response => {
                console.log(response.data.message);
            })
            .catch(error => {
                console.error('Error calling the API:', error.response ? error.response.data : error.message);
            });
    };

    const handleDisplayButtonClick = () => {
        if (productToDisplay) {
            displayProduct(productToDisplay.id);
        }
    };

    const toggleSelectProduct = (product) => {
        if (productToDisplay && productToDisplay.id === product.id) {
            setProductToDisplay(null);
        } else {
            setProductToDisplay(product);
        }
    };

    const filteredProducts = selectedProducts.filter(product =>
        product.ean.toString().includes(searchQuery) ||
        product.product_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filteredProducts.length === 0) {
        return (
            <>
                <header className="header">
                    <ControlPanel sector={sector} setSector={setSector} />
                    <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                    <p>No products selected</p>
                </header>
            </>
        );
    }

    return (
        <>
            <header className="header">
                <ControlPanel sector={sector} setSector={setSector} />
                <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            </header>
            <div className="selectedProductsList">
                {filteredProducts.map(product => (
                    <SelectedProductsItem
                        key={product.ean}
                        product={product}
                        onSelect={toggleSelectProduct}
                        onUnselect={unselect}
                        isSelected={productToDisplay && productToDisplay.id === product.id}
                    />
                ))}
            </div>
            <DeliverButton onClick={handleDisplayButtonClick}>
                Display
            </DeliverButton>
        </>
    );
};

export default SelectedProductsTable;
