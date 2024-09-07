import React from 'react';
import ListItem from '../ListItem/ListItem';
import './DisplayList.scss';

const DisplayList = ({ items, keyAttribute, idAttribute, textAttribute,
                         selectedItems, onClick, onIconClick, Icon }) => {
    return (
        <div className="displayList">
            {items.map(item => (
                <ListItem
                    key={item[keyAttribute]}
                    item={item}
                    idAttribute={idAttribute}
                    textAttribute={textAttribute}
                    isSelected={selectedItems.includes(item.id)}
                    onClick={onClick}
                    onIconClick={onIconClick}
                    Icon={Icon}
                />
            ))}
        </div>
    );
};

export default DisplayList;