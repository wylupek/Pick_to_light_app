import React, { useEffect, useState } from 'react';
import './SuppliersTable.scss';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';
import axios from 'axios';
import config from '../../config';

const SuppliersTable = () => {
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
                            state: { searchQuery: product.ean}
                        });
                        setSearchQuery('');
                    }
                })
                .catch(error => {
                    console.error('Product not found!', error.message);
                });
        }
    }, [searchQuery, navigate]);

    const handleRowClick = (supp_id) => {
        navigate(`/products/${supp_id}`);
    };

    const filteredSuppliers = suppliers.filter(supplier =>
        supplier.supp_id.toString().includes(searchQuery) ||
        supplier.supp_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filteredSuppliers.length === 0) {
        return (
            <>
                <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                <p>No suppliers available</p>
            </>
        );
    }

    return (
        <>
            <header className="header">
                <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            </header>
            <table className='suppliersTable'>
                <tbody>
                {filteredSuppliers.map(supplier => (
                    <tr key={supplier.supp_id} onClick={() => handleRowClick(supplier.supp_id)}>
                        <td>{supplier.supp_id}</td>
                        <td>{supplier.supp_name}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    );
};

export default SuppliersTable;