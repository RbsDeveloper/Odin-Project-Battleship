
export function attachStartBtnLister (element, callback) {
    element.addEventListener("click", callback)
}

export function attachFormEventListener (element, callback) {
    element.addEventListener("submit", callback)
}

export function attachActiveShipEventListener (element, callback) {
    element.addEventListener("click", (event) => {
        const targetEl = event.target;
        if(targetEl.classList.contains("ship")){
            console.log(event.target)
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
        console.log(event)
        const target = event.target;
        if(target.id){
            console.log("it has an Id");
            callback(target.id);
        }else{
            console.log("No Id here");
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
            console.log('dragging')
            console.log(draggedElement);
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
