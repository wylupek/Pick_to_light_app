import React, { useState } from 'react';
import './SuppliersTable.scss';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';

const SuppliersTable = ({ suppliers }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleRowClick = (supp_id) => {
        navigate(`/products/${supp_id}`);
    }

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
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <table className='suppliersTable'>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                </tr>
                </thead>
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
}

export default SuppliersTable;
