import React from 'react';
import './SuppliersList.scss';

const SuppliersList = ({ suppliers, onRowClick }) => {
    return (
        <table className='suppliersTable'>
            <tbody>
            {suppliers.map(supplier => (
                <tr key={supplier.supp_id} onClick={() => onRowClick(supplier.supp_id)}>
                    <td>{supplier.supp_id}</td>
                    <td>{supplier.supp_name}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default SuppliersList;
