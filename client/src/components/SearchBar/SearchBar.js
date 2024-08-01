// SearchBar.js
import React from 'react';
import './SearchBar.scss';
import searchIcon from '../../assets/searchicon.png'; // Adjust the path as necessary


const SearchBar = ({ searchQuery, setSearchQuery }) => {
    const handleChange = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <div className="searchBar">
            <img src={searchIcon} alt="Search Icon" className="searchIcon"/>
            <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={handleChange}
            />
        </div>
    );
};

export default SearchBar;
