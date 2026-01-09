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