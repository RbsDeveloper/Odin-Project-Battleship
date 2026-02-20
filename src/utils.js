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

export function getRandomDirection () {
    return Math.random() < 0.5 ? "horizontal" : "vertical";
}

export function getRandomCoord (gridSize = 10) {
    return Math.floor(Math.random() * gridSize);
}

export function opponentIndex (currentIdx) {
    return 1-currentIdx;
}

export function delayActions (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function generateAttackMoves () {
    const coords = [];

    for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 10; c++) {
            coords.push({ row: r, col: c });
        }
    }

    let i = coords.length, j, temp;

    while(--i > 0){
        j = Math.floor(Math.random()*(i+1));
        temp = coords[j];
        coords[j] = coords[i];
        coords[i] = temp
    }
    return coords;
}