import './style.css';
import React from 'react';

export default function Square(props) {
    return (
        <button className="square" onClick={props.onClick} id={props.id}>
            {props.value}
        </button>
    );
}
