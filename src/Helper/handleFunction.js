import * as Type from "../contant";

export function calculateDESC(i, squares, type) {
    let number = 1;
    if (squares[i] === null) {
        return null;
    }

    for (let index = i, count = 1; count < 5; count++ , index += type) {
        if (squares[i] !== squares[index + type])
            return null;
        else {
            number++;
        }

    }
    return number === 5 ? squares[i] : null;
}

export function calculateASC(i, squares, type) {
    let number = 1;
    if (squares[i] === null) {
        return null;
    }
    for (let index = i, count = 1; count < 5; count++ , index -= type) {
        if (squares[i] !== squares[index - type])
            return null;
        else
            number++;
    }

    return number === 5 ? squares[i] : null;
}

export function calculateBetween(i, squares, type) {
    let number = 1;
    /*eslint no-mixed-operators: "off"*/

    if ((squares[i] === null) || (squares[i] !== squares[i - type]) && (squares[i] !== squares[i + type])) {
        return null;
    }
    let min, max = null;
    for (let index = i + type, count = 1; count < 5; count++ , index += type) {
        if (squares[i] === squares[index]) {
            max = index;
            number++;
        }
    }
    for (let index = i - type, count = 1; count < 5; count++ , index -= type) {
        if (index >= 0 && squares[i] === squares[index]) {
            min = index;
            number++;
        }
        if (index < 0) {
            break;
        }
    }

    for (min; min <= max; min += type) {
        if (squares[min] === null || squares[min] !== squares[i])
            return null;
    }

    return number >= 5 ? squares[i] : null;
}

export function isBlock(i, squares, type) {
    let min, max = null;
    for (let index = type; index < 5 * type; index += type) {
        if (squares[i + index] !== null && squares[i] !== squares[index + i]) {
            max = index + i;
        }
    }
    for (let index = type, count = 0; count < 5; count++ , index -= type) {
        if (squares[i - index] !== null && squares[i] !== squares[i - index])
            min = i - index;
    }
    return min && max ? null : squares[i];
}

export function checkBlock(i, squares) {
    const type = checkType(i, squares);
    return isBlock(i, squares, type);
}

export function checkType(i, squares) {
    if (squares[i] === squares[i + Type.ROW] || squares[i] === squares[i - Type.ROW]) {
        return Type.ROW;
    }
    if (squares[i] === squares[i + Type.COLUMN] || squares[i] === squares[i - Type.COLUMN]) {
        return Type.COLUMN;
    }
    if (squares[i] === squares[i + Type.PRIMARY_DIAGONAL] || squares[i] === squares[i - Type.PRIMARY_DIAGONAL]) {
        return Type.PRIMARY_DIAGONAL;
    }
    if (squares[i] === squares[i + Type.SECONDARY_DIAGONAL] || squares[i] === squares[i - Type.SECONDARY_DIAGONAL]) {
        return Type.SECONDARY_DIAGONAL;
    }
    return null;
}

export function calculateWinner(i, squares) {
    if (squares[i] === squares[i + Type.ROW]) {
        return calculateDESC(i, squares, Type.ROW) || calculateBetween(i, squares, Type.ROW)
    }
    else if (squares[i] === squares[i - Type.ROW]) {
        return calculateASC(i, squares, Type.ROW) || calculateBetween(i, squares, Type.ROW);
    }
    if (squares[i] === squares[i + Type.COLUMN]) {
        return calculateDESC(i, squares, Type.COLUMN) || calculateBetween(i, squares, Type.COLUMN)
    }
    else if (squares[i] === squares[i - Type.COLUMN]) {
        return calculateASC(i, squares, Type.COLUMN) || calculateBetween(i, squares, Type.COLUMN)
    }
    if (squares[i] === squares[i + Type.PRIMARY_DIAGONAL]) {
        return calculateDESC(i, squares, Type.PRIMARY_DIAGONAL) || calculateBetween(i, squares, Type.PRIMARY_DIAGONAL)
    }
    else if (squares[i] === squares[i - Type.PRIMARY_DIAGONAL]) {
        return calculateASC(i, squares, Type.PRIMARY_DIAGONAL) || calculateBetween(i, squares, Type.PRIMARY_DIAGONAL)
    }
    if (squares[i] === squares[i + Type.SECONDARY_DIAGONAL]) {
        return calculateDESC(i, squares, Type.SECONDARY_DIAGONAL) || calculateBetween(i, squares, Type.SECONDARY_DIAGONAL)
    }
    else if (squares[i] === squares[i - Type.SECONDARY_DIAGONAL]) {
        return calculateASC(i, squares, Type.SECONDARY_DIAGONAL) || calculateBetween(i, squares, Type.SECONDARY_DIAGONAL)
    }
    return null;
}

export function styleWinner(i, squares) {
    const type = checkType(i, squares);
    for (let index = i, count = 0; count < 5; count++ , index += type) {
        if (squares[index] !== null) {
            document.getElementById(index).style.color = "yellow";
        }
    }
    for (let index = i, count = 0; count < 5; count++ , index -= type) {
        if (index >= 0 && squares[index] !== null) {
            document.getElementById(index).style.color = "yellow";
        }
        if (index < 0) {
            break;
        }
    }
}