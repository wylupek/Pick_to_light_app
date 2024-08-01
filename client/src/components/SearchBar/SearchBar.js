// SearchBar.js
import React, { useRef, useEffect } from 'react';
import './SearchBar.scss';
import searchIcon from '../../assets/searchicon.png'; // Adjust the path as necessary

const SearchBar = ({ searchQuery, setSearchQuery }) => {
    const inputRef = useRef(null);

    useEffect(() => {
        // Focus the input element when the component mounts
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const handleChange = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <div className="searchBar">
            <img src={searchIcon} alt="Search Icon" className="searchIcon" />
            <input
                ref={inputRef}
                type="text"
                placeholder="Search by EAN or Name"
                value={searchQuery}
                onChange={handleChange}
            />
        </div>
    );
};

export default SearchBar;
