import React from 'react';
import './CustomListItem.scss';

const CustomListItem = ({ item, idAttribute, textAttribute,
                      isSelected, onClick, onIconClick, Icon }) => {
    return (
        <div
            className={`customListItem ${isSelected ? 'selected' : ''} ${Icon ? 'withIcon' : 'withoutIcon'}`}
            onClick={() => onClick(item)}
        >
            {Icon && (
                <Icon
                    alt="Unselect"
                    className="unselectIcon"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (onIconClick) {
                            onIconClick(item.id);
                        }
                        else {
                            onClick(item)
                        }
                    }}
                />
            )}
            <div className="productInfo">
                <div className="productId">{item[idAttribute]}</div>
                <div className="productText">{item[textAttribute]}</div>
            </div>
        </div>
    );
};

export default CustomListItem;
