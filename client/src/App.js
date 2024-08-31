import axios from 'axios';
import './App.scss';
import React, { useEffect, useState } from 'react';
import SuppliersTable from './components/SuppliersTable/SuppliersTable';
import ProductsTable from './components/ProductsTable/ProductsTable';
import SelectedProductsTable from './components/SelectedProductsTable/SelectedProductsTable';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import config from  './config';

const apiSuppliers = (setSuppliers) => {
    axios.post(`${config.server.url}/api/suppliers`)
        .then(response => {
            setSuppliers(response.data);
        })
        .catch(err => {
            console.error(err);
        });
}

function App() {
    const [suppliers, setSuppliers] = useState([]);

    useEffect(() => {
        apiSuppliers(setSuppliers);
    }, []);

    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    <Routes>
                        <Route path="/" element={<SuppliersTable suppliers={suppliers} />} />
                        <Route path="/products/:id" element={<ProductsTable />} />
                        <Route path="/selected-products" element={<SelectedProductsTable />} />
                    </Routes>
                </header>
            </div>
        </Router>
    );
}

export default App;

// TODO Take care of max POST size