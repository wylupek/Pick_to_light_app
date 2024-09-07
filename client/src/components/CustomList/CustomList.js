import React from 'react';
import CustomListItem from '../CustomListItem/CustomListItem';
import './CustomList.scss';

const CustomList = ({ items, keyAttribute, idAttribute, textAttribute,
                         selectedItems, onClick, onIconClick, Icon }) => {
    return (
        <div className="customList">
            {items.map(item => (
                <CustomListItem
                    key={item[keyAttribute]}
                    item={item}
                    idAttribute={idAttribute}
                    textAttribute={textAttribute}
                    isSelected={selectedItems && selectedItems.includes(item.id)}
                    onClick={onClick}
                    onIconClick={onIconClick}
                    Icon={Icon}
                />
            ))}
        </div>
    );
};

export default CustomList;