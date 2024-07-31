import React from 'react';
import './SuppliersTable.scss';
import { useNavigate } from 'react-router-dom';

const SuppliersTable = ({ suppliers }) => {
    const navigate = useNavigate();

    const handleRowClick = (supp_id) => {
        navigate(`/products/${supp_id}`);
    }

    if (suppliers.length === 0) {
        return <p>No suppliers available</p>;
    }

    return (
        <table className='suppliersTable'>
            <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
            </tr>
            </thead>
            <tbody>
            {suppliers.map(supplier => (
                <tr key={supplier.supp_id} onClick={() => handleRowClick(supplier.supp_id)}>
                    <td>{supplier.supp_id}</td>
                    <td>{supplier.supp_name}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}

export default SuppliersTable;
