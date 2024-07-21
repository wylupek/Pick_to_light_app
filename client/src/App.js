//App.js

import axios from 'axios';
import './App.css';
import React, { useEffect, useState } from 'react';

const apiProducts = () => {
    axios.post('http://localhost:8080/api/products')
        .then(response => {
            console.log(response.data)
        })
        .catch(err => {
            console.error(err);
        });
}

const apiValues = (id) => {
    axios.post('http://localhost:8080/api/values', { id: id})
        .then(response => {
            console.log(response.data)
        })
        .catch(err => {
            console.error(err);
        });
}

function App() {
  return (
    <div className="App">
        <header className="App-header">
            <button onClick={() => apiValues(1)}>apiValues</button>
            <button onClick={apiProducts}>apiProducts</button>
        </header>
    </div>
  );
}

export default App;