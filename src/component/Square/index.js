import './style.css';
import React from 'react';

const Square = ({ onClick, id, value }) => {
    return (
        <button className="square" onClick={onClick} id={id}>
            {value}
        </button>
    );
}

export default Square;