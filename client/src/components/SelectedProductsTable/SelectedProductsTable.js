import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './SelectedProductsTable.scss';
import ControlPanel from "../ControlPanel/ControlPanel";
import SearchBar from "../SearchBar/SearchBar";
import axios from "axios";
import config from "../../config";
import DeliverButton from '../DeliverButton/DeliverButton'; // Import the DeliverButton component

const SelectedProductsTable = () => {
    const location = useLocation();
    const { selectedProducts } = location.state || { selectedProducts: [] };
    const [searchQuery, setSearchQuery] = useState('');
    const [sector, setSector] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState(null); // Only one selected product

    const deleteProduct = (id) => {
        console.log("Delete", id);
    };

    const displayProduct = (productId) => {
        console.log("Display", productId);
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

    const toggleSelectProduct = (product) => {
        if (selectedProduct && selectedProduct.id === product.id) {
            setSelectedProduct(null); // Deselect if the same product is clicked again
        } else {
            setSelectedProduct(product); // Select the clicked product
        }
    };

    const handleDisplayButtonClick = () => {
        if (selectedProduct) {
            displayProduct(selectedProduct.id); // Call displayProduct with the selected product's ID
        }
    };

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
                {selectedProducts.map(product => (
                    <tr
                        key={product.ean}
                        className={selectedProduct && selectedProduct.id === product.id ? 'selectedRow' : ''}
                        onClick={() => toggleSelectProduct(product)}
                    >
                        <td className="deleteCell" onClick={() => deleteProduct(product.id)}>
                            Delete
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
