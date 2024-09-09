import React, { useState, useEffect } from 'react';
import './DisplayPage.scss';
import CustomList from '../../components/CustomList/CustomList';
import ControlPanel from '../../components/ControlPanel/ControlPanel';
import SearchBar from '../../components/SearchBar/SearchBar';
import DeliverButton from '../../components/DeliverButton/DeliverButton';
import axios from 'axios';
import config from '../../config';
import { ReactComponent as UnselectIcon } from '../../assets/delete.svg';

const DisplayPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [sector, setSector] = useState(1);
    const [productToDisplay, setProductToDisplay] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [isClicked, setIsClicked] = useState(false);
    const [showNoProductsMessage, setShowNoProductsMessage] = useState(false);

    // Load selected products from sessionStorage on component mount
    useEffect(() => {
        const storedSelectedProducts = JSON.parse(sessionStorage.getItem('selectedProducts')) || [];
        setSelectedProducts(storedSelectedProducts);
        setShowNoProductsMessage(true);
    }, []);

    // Unselect a product
    const unselectProduct = (productId) => {
        const updatedProducts = selectedProducts.filter(product => product.id !== productId);
        setSelectedProducts(updatedProducts);
        sessionStorage.setItem('selectedProducts', JSON.stringify(updatedProducts));
    };

    // Display a product based on sector
    const displayProduct = (productId) => {
        axios.post(`${config.server.url}/api/displaySector`, {
            json: {
                productId: productId,
                sector: sector
            }
        })
            .then(response => {
                console.log(response.data.message);
            })
            .catch(error => {
                console.error('Error calling the API:', error.response ? error.response.data : error.message);
            });
    };

    const handleDisplayButtonClick = () => {
        if (productToDisplay) {
            displayProduct(productToDisplay);

            // Change button color
            setIsClicked(true);
            setTimeout(() => {
                setIsClicked(false);
            }, 1500);
        }
    };


    // Toggle product selection
    const toggleSelectProduct = (product) => {
        if (productToDisplay && productToDisplay === product.id) {
            setProductToDisplay(null);
        } else {
            setProductToDisplay(product.id);
        }
    };

    // Filter products based on the search query
    const filteredProducts = selectedProducts.filter(product =>
        product.ean.toString().includes(searchQuery) ||
        product.product_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="SelectedProductsPage">
            <header className="header">
                <ControlPanel sector={sector} setSector={setSector} />
                <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            </header>
            {showNoProductsMessage && filteredProducts.length === 0 ? (
                <p className="p">No products selected</p>
            ) : (
                <>
                    <div className="listContainer">
                        <CustomList
                            items={filteredProducts}
                            keyAttribute={"id"}
                            idAttribute={"ean"}
                            textAttribute={"product_name"}
                            selectedItems={[productToDisplay]}
                            onClick={toggleSelectProduct}
                            onIconClick={unselectProduct}
                            Icon={UnselectIcon}
                        />
                    </div>

                    <DeliverButton onClick={handleDisplayButtonClick}  isClicked={isClicked}>
                        Display
                    </DeliverButton>
                </>
            )}
        </div>
    );
};

export default DisplayPage;
