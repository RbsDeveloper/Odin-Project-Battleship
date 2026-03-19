export function attachStartBtnLister (element, callback) {
    element.addEventListener("click", callback)
}

export function attachFormEventListener (element, callback) {
    element.addEventListener("submit", callback)
}

export function attachActiveShipEventListener (element, callback) {
    element.addEventListener("click", (event) => {
        const targetEl = event.target.closest(".ship");
        if(targetEl && targetEl.classList.contains("ship")){
            callback(targetEl.id);
        }
    })
}

export function attachBoardEventListener (element, callback) {
    element.addEventListener("click", (event) => {
        const cell = event.target.closest(".cell");
        if(!cell) return;
        callback(cell);
    })
}

export function attachPlacementBtnsEventListener (element, callback) {
    element.addEventListener("click", (event) => {
        const target = event.target;
        if(target.id){
            callback(target.id);
        }
    })
}

export function attachConfirmBtnListener (element, callback) {
    element.addEventListener("click", callback);
}

export function attachEventForNewGamebtn (element, callback) {
    element.addEventListener("click", callback)
}

export function attachEventForPlayAgainBtn (element, callback) {
    element.addEventListener("click", callback)
}

export function attachDragStartListener (element, callback) {
    element.addEventListener('dragstart', (event) => {

        const draggedElement = event.target

        if(draggedElement.classList.contains("ship")){
            callback(draggedElement.id)
        }
    })
}

export function attachDragOverEvent (element, callback) {
    element.addEventListener('dragover', (event) => {
        event.preventDefault();
        const cell = event.target.closest(".cell");
        if(!cell) return
        const cellRow = parseInt(cell.dataset.row);
        const cellCol = parseInt(cell.dataset.col);
        
        callback(cellRow, cellCol);
    })
}

export function attachDragLeaveEvent (element, callback) {
    element.addEventListener('dragleave', callback)
}

export function attachDropEvent (element, callback) {
    element.addEventListener("drop", (event)=> {
        event.preventDefault()
        const cell = event.target.closest(".cell");
        
        if(!cell) return
        const cellRow = parseInt(cell.dataset.row);
        const cellCol = parseInt(cell.dataset.col);
        callback(cellRow, cellCol)
    })
}

export function setUpModeToggle (element, callback) {
    element.addEventListener("click", callback)
}

export function attachValidationListener (element, callback){
    element.addEventListener("input", callback);
}