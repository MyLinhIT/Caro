import './style.css';
import React from 'react';

const Square = ({ onClick, id, value, disable }) => {
    return (
        <button className="square" onClick={onClick} id={id} disabled={disable}>
            {value}
        </button>
    );
}

export default Square;