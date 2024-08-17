const axios = require('axios');
const fs = require('fs');
const path = require('path');
const config = require('./config');

const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const baseUrl = config.data_url_base;
const date = getCurrentDate();
const url = `${baseUrl}-${date}`;

const filePath = path.join(__dirname, 'data', 'data.txt');

const fetchDataAndSave = async () => {
    try {
        const response = await axios.get(url);

        if (!response.data || response.data.length === 0) {
            console.log('Received empty or null data from the URL. Saving empty file.');
            await fs.promises.writeFile(filePath, '');
            return;
        }

        const data = response.data;

        const rows = data.map(item => {
            return `${item.id_official};${item.seller_name};${item.ean};${item.name};${item.all};${item.orders}`;
        });
        const formattedData = rows.join('\n');

        await fs.promises.writeFile(filePath, formattedData);
        console.log('Data successfully saved to', filePath);
    } catch (error) {
        if (error.response) {
            console.error('Error response from server:', error.response.status, error.response.statusText);
        } else if (error.request) {
            console.error('No response received:', error.request);
        } else {
            console.error('Error setting up the request:', error.message);
        }
    }
};

fetchDataAndSave().catch(error => {
    console.error('Unhandled error:', error);
});
