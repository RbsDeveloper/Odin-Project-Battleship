import {createCells} from "../uiUtils/domHelpers.js"

export function markCellsOccupied (playerId, coords) {
    coords.forEach(([r , c]) => {
        const cell = document.querySelector(`.gridField[data-player-id = '${playerId}'] .cell[data-row='${r}'][data-col='${c}']`)
        cell.classList.add("ship-placed");
    })
}

export function resetBoardUi (playerId, boardsDetails) {
    const targetBoard = document.querySelector(`.gridField[data-player-id = '${playerId}']`);
    targetBoard.innerHTML = "";
    createCells(targetBoard, boardsDetails);
}

export function resetFleetUi (playerId) {
    const shipsContainer = document.querySelector(`.shipContainer[data-player-id = '${playerId}']`)
    if(!shipsContainer) return;

    [...shipsContainer.children].forEach(ship => {
         ship.classList.remove("active", "placed");
    }); 
}

export function highlightPlacement (playerId, coords, isValid) {
    const className = isValid ? "preview-valid" : "preview-invalid";
    coords.forEach(([r,c]) => {
        const cell = document.querySelector(`.gridField[data-player-id ='${playerId}'] .cell[data-row='${r}'][data-col='${c}']`);
        if(cell){
            cell.classList.add(className);
        }
    }) 
}

export function resetHighlightPlacement (playerId) {
    let highlightedCells = document.querySelectorAll(
        `.gridField[data-player-id='${playerId}'] .cell.preview-valid,
         .gridField[data-player-id='${playerId}'] .cell.preview-invalid`
        );
     
        highlightedCells.forEach(cell => {
        cell.classList.remove("preview-valid", "preview-invalid");
        }) 
}

export function enableConfirmBtn () {
    const confirmBtn = document.getElementById("confirmPlacementBtn");
    confirmBtn.disabled = false;
    confirmBtn.classList.add("confirmReady")
}

export function disableConfirmBtn () {
    const confirmBtn = document.getElementById("confirmPlacementBtn");
    if(!confirmBtn.disabled) confirmBtn.disabled = true;
    if(confirmBtn.classList.contains("confirmReady")) confirmBtn.classList.remove("confirmReady")
}
  
export function clearPlacementComponents () {
    const fleetContainer = document.getElementById("fleetPlacementControls");
    fleetContainer.innerHTML = "";
    const interactiveBoards = document.getElementById("placementArea");
    interactiveBoards.innerHTML = ""

}

export function updateDirectionButtons(activeDirection) {
    const horizBtn = document.getElementById('horizBtn');
    const vertBtn = document.getElementById('vertBtn');

    if (activeDirection === 'horizontal') {
        horizBtn.classList.add('active');
        vertBtn.classList.remove('active');
    } else {
        vertBtn.classList.add('active');
        horizBtn.classList.remove('active');
    }
}