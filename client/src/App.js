//App.js

import axios from 'axios';
import './App.css';
import React, { useEffect, useState } from 'react';

//data will be the string we send from our server
const apiCall2 = () => {
  axios.get('http://localhost:8080/api/list').then((data) => {
    //this console.log will be in our frontend console
    console.log(data)
  })
}

const apiCall = () => {
    axios.post('http://localhost:8080/api/products', { id: 1 })
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

            <button onClick={apiCall}>Console log full data</button>
            <button onClick={apiCall2}>Log message</button>

        </header>
    </div>
  );
}

export default App;