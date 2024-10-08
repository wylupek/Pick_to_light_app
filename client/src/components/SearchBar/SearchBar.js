import React, { useRef } from 'react';
import './SearchBar.scss';
import { ReactComponent as SearchIcon } from '../../assets/search.svg';
import { ReactComponent as DeleteIcon } from '../../assets/delete_x.svg';

const SearchBar = ({ searchQuery, setSearchQuery }) => {
    const inputRef = useRef(null);

    const handleChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleClick = () => {
        if (inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    };

    const handleDelete = () => {
        setSearchQuery('');
    };

    return (
        <div className="searchBar">
            <SearchIcon className="searchIcon"/>
            <input
                ref={inputRef}
                type="text"
                placeholder="Search by EAN or Name"
                value={searchQuery}
                onChange={handleChange}
                onClick={handleClick}
            />
            <DeleteIcon className="deleteIcon" onClick={handleDelete}/>
        </div>
    );
};

export default SearchBar;
