import './style.scss';
import React from 'react';

const Square = ({ onClick, id, value, disable,indexCheck }) => {

    let className = value === "X" ? "square__X": "square__O";
    className += indexCheck === id ? " square__active": "";
    
    return (
        <button className={className + " square"} onClick={onClick} id={id} disabled={disable}>
            {value}
        </button>
    );
}

export default Square;