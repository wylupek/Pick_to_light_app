import './App.scss';
import React from 'react';
import SuppliersPage from "./Pages/SuppliersPage/SuppliersPage";
import ProductsTable from './components/ProductsTable/ProductsTable';
import SelectedProductsTable from './components/SelectedProductsTable/SelectedProductsTable';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    <Routes>
                        <Route path="/" element={<SuppliersPage />} />
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