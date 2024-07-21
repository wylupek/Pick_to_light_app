import React from 'react';
import './SuppliersTable.css';

const SuppliersTable = ({ suppliers: suppliers }) => {
    if (suppliers.length === 0) {
        return <p>No products available</p>;
    }

    return (
        <table>
            <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
            </tr>
            </thead>
            <tbody>
            {suppliers.map(supplier => (
                <tr key={supplier.id}>
                    <td>{supplier.supp_id}</td>
                    <td>{supplier.supp_name}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}

export default SuppliersTable;
