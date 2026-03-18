export function createCompleteElement (tag, classes = [], text = "", attributes = {}) {
    const element =  document.createElement(tag);
    
    if(classes.length){
        element.classList.add(...classes);
    }

    if(text){
        element.textContent = text
    }

    for(const [key, value] of Object.entries(attributes)){
        element.setAttribute(key, value);
    }

    return element;
}

export function clearWindow () {
    document.body.innerHTML = "";
}

export function createCells (container, board) {
    for(let i = 0 ; i < board.length; i++){

        for(let j = 0; j < board[i].length ; j++){

            const cell = createCompleteElement('div', ['cell'], '', {"data-row": `${i}`, "data-col": `${j}`})

            container.append(cell);

        }

    }
}