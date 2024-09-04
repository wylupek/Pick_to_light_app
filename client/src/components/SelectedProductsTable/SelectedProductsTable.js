import React, { useState, useEffect } from 'react';
import './SelectedProductsTable.scss';
import ControlPanel from "../ControlPanel/ControlPanel";
import SearchBar from "../SearchBar/SearchBar";
import axios from "axios";
import config from "../../config";
import DeliverButton from '../DeliverButton/DeliverButton';

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
        // console.log("Unselect", productId);
        const updatedProducts = selectedProducts.filter(product => product.id !== productId);
        setSelectedProducts(updatedProducts);
        sessionStorage.setItem('selectedProducts', JSON.stringify(updatedProducts));
    };

    const displayProduct = (productId) => {
        // console.log("Display", productId);
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

    if (selectedProducts.length === 0) {
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
            <table className='selectedProductsTable'>
                <tbody>
                {filteredProducts.map(product => (
                    <tr
                        key={product.ean}
                        className={productToDisplay && productToDisplay.id === product.id ? 'selectedRow' : ''}
                        onClick={() => toggleSelectProduct(product)}
                    >
                        <td className="deleteCell" onClick={(e) => { e.stopPropagation(); unselect(product.id); }}>
                            Unselect
                        </td>
                        <td>{product.ean}</td>
                        <td>{product.product_name}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <DeliverButton onClick={handleDisplayButtonClick}>
                Display
            </DeliverButton>
        </>
    );
};

export default SelectedProductsTable;
