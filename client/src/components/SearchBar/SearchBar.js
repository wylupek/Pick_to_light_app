import React, { useRef, useEffect } from 'react';
import './SearchBar.scss';
import { ReactComponent as SearchIcon } from '../../assets/search.svg';

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
            <SearchIcon className="searchIcon" />
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
