import axios from 'axios';
import './App.scss';
import React, { useEffect, useState } from 'react';
import SuppliersTable from './components/SuppliersTable/SuppliersTable';
import ProductsTable from './components/ProductsTable/ProductsTable';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const apiSuppliers = (setSuppliers) => {
    axios.post('http://192.168.1.100:8080/api/suppliers')
        .then(response => {
            setSuppliers(response.data);
        })
        .catch(err => {
            console.error(err);
        });
}

function App() {
    const [suppliers, setSuppliers] = useState([]);

    // Fetch suppliers when the component mounts
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
                    </Routes>
                </header>
            </div>
        </Router>
    );
}

export default App;

// TODO Make it visible on local network
// TODO Take care of max POST size