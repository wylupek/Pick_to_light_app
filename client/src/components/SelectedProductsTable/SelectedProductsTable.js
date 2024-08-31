import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './SelectedProductsTable.scss';
import ControlPanel from "../ControlPanel/ControlPanel";
import SearchBar from "../SearchBar/SearchBar";
import axios from "axios";
import config from "../../config";
import DeliverButton from '../DeliverButton/DeliverButton';

const SelectedProductsTable = () => {
    const location = useLocation();
    const { selectedProducts } = location.state || { selectedProducts: [] };
    const [searchQuery, setSearchQuery] = useState('');
    const [sector, setSector] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [products, setProducts] = useState(selectedProducts); // Local state for products

    const deleteProduct = (productId) => {
        console.log("Delete", productId);
        axios.post(`${config.server.url}/api/deleteById`, { id: productId })
            .then(response => {
                console.log(response.data.message);
                // Update local state to remove the deleted product
                setProducts(products.filter(product => product.id !== productId));
            })
            .catch(error => {
                console.error('Error deleting product:', error.response ? error.response.data : error.message);
            });
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

    const handleDisplayButtonClick = () => {
        if (selectedProduct) {
            displayProduct(selectedProduct.id);
        }
    };

    const toggleSelectProduct = (product) => {
        if (selectedProduct && selectedProduct.id === product.id) {
            setSelectedProduct(null);
        } else {
            setSelectedProduct(product);
        }
    };

    if (products.length === 0) {
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
                {products.map(product => (
                    <tr
                        key={product.ean}
                        className={selectedProduct && selectedProduct.id === product.id ? 'selectedRow' : ''}
                        onClick={() => toggleSelectProduct(product)}
                    >
                        <td className="deleteCell" onClick={(e) => { e.stopPropagation(); deleteProduct(product.id); }}>
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
