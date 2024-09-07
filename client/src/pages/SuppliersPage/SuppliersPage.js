import React, { useEffect, useState } from 'react';
import './SuppliersPage.scss';
import SearchBar from '../../components/SearchBar/SearchBar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DeliverButton from '../../components/DeliverButton/DeliverButton';
import config from '../../config';
import CustomList from "../../components/CustomList/CustomList";

const SuppliersPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [suppliers, setSuppliers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.post(`${config.server.url}/api/suppliers`)
            .then(response => {
                setSuppliers(response.data);
            })
            .catch(err => {
                console.error(err);
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


    return (
        <div className="SuppliersPage">
            <header className="header">
                <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            </header>
            {filteredSuppliers.length === 0 ? (
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
