import React, { useEffect, useState } from 'react';
import './SuppliersPage.scss';
import SearchBar from '../../components/SearchBar/SearchBar';
import TestPanel from '../../components/TestPanel/TestPanel';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DeliverButton from '../../components/DeliverButton/DeliverButton';
import config from '../../config';
import CustomList from "../../components/CustomList/CustomList";

const SuppliersPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [suppliers, setSuppliers] = useState([]);
    const navigate = useNavigate();
    const [showNoProductsMessage, setShowNoProductsMessage] = useState(false);
    const [currentPattern, setCurrentPattern] = useState(0);
    
    const SECTOR_LENGTH = config.constants.SECTOR_LENGTH;
    
    // Define test patterns - easy to extend
    const testPatterns = [
        { name: 'Pattern 1', generator: () => Array(SECTOR_LENGTH).fill(88) },
        { name: 'Pattern 2', generator: () => Array.from({ length: SECTOR_LENGTH }, (_, i) => i + 1) }
    ];

    useEffect(() => {
        axios.post(`${config.server.url}/api/suppliers`)
            .then(response => {
                setSuppliers(response.data);
            })
            .catch(err => {
                console.error(err);
            })
            .finally(() => {
                setShowNoProductsMessage(true);
            });
    }, []);

    useEffect(() => {
        if (searchQuery.length === 13 && /^\d{13}$/.test(searchQuery)) {
            axios.post(`${config.server.url}/api/productByEan`, { ean: searchQuery })
                .then(response => {
                    const products = response.data;
                    if (products.length > 0) {
                        const product = products[0];
                        navigate(`/products/${product.supp_id}`, {
                            state: { searchQuery: product.ean }
                        });
                        setSearchQuery('');
                    }
                })
                .catch(error => {
                    console.error('Product not found!', error.message);
                });
        }
    }, [searchQuery, navigate]);

    const filteredSuppliers = suppliers.filter(supplier =>
        supplier.supp_id.toString().includes(searchQuery) ||
        supplier.supp_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleRowClick = (supplier) => {
        navigate(`/products/${supplier.supp_id}`);
    };

    const handleDeliverButtonClick = () => {
        navigate('/selected-products');
    };

    const handleTestClick = () => {
        const pattern = testPatterns[currentPattern];
        const testPattern = pattern.generator();
        console.log(`Executing ${pattern.name}:`, testPattern);
        
        // Call API to create test files
        axios.post(`${config.server.url}/api/testDisplay`, { testPattern })
            .then(response => {
                console.log(response.data.message);
            })
            .catch(error => {
                console.error('Error calling test API:', error.response ? error.response.data : error.message);
            });
        
        // Cycle to next pattern
        setCurrentPattern((prev) => (prev + 1) % testPatterns.length);
    };

    const handleOffClick = () => {
        const zerosArray = Array(SECTOR_LENGTH).fill(0);
        console.log('Turning off displays:', zerosArray);
        
        // Call API to create files with zeros
        axios.post(`${config.server.url}/api/testDisplay`, { testPattern: zerosArray })
            .then(response => {
                console.log(response.data.message);
            })
            .catch(error => {
                console.error('Error calling off API:', error.response ? error.response.data : error.message);
            });
    };


    return (
        <div className="SuppliersPage">
            <header className="header">
                <TestPanel onTestClick={handleTestClick} onOffClick={handleOffClick} />
                <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            </header>
            {showNoProductsMessage && filteredSuppliers.length === 0 ? (
                <>
                    <p className="p">No suppliers available</p>
                </>
            ) : (
                <>
                    <div className="listContainer">
                        <CustomList
                            items={filteredSuppliers}
                            keyAttribute={"supp_id"}
                            idAttribute={"supp_id"}
                            textAttribute={"supp_name"}
                            onClick={handleRowClick}
                        />
                    </div>
                </>
            )}
            <DeliverButton onClick={handleDeliverButtonClick}>
                Deliver
            </DeliverButton>
        </div>
    );
};

export default SuppliersPage;
