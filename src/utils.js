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