import SuppliersTable from './components/SuppliersTable/SuppliersTable';
import axios from 'axios';
import './App.css';
import React, { useEffect, useState } from 'react';

const apiSuppliers = (setSuppliers) => {
    axios.post('http://192.168.1.100:8080/api/suppliers')
        .then(response => {
            setSuppliers(response.data);
        })
        .catch(err => {
            console.error(err);
        });
}

const apiValues = (id) => {
    axios.post('http://192.168.1.100:8080/api/values', { id: id})
        .then(response => {
            console.log(response.data)
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
        <div className="App">
            <header className="App-header">
                <SuppliersTable suppliers={suppliers} />
            </header>
        </div>
    );
}

export default App;

// TODO Make it visible on local network
// TODO Take care of max POST size