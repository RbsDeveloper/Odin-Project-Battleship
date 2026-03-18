import {createCompleteElement, createCells} from "../uiUtils/domHelpers.js"

export function renderGameboard (player) {
    
    const boardContainer = createCompleteElement('div', ['board'], '');
    const header = createCompleteElement('div', ["boardHeader"]);
        header.append(
            createCompleteElement("span", ["tacticalLabel"], "Your Fleet"),
            createCompleteElement("h2", ["boardOwner"], `${player.id}`)
        );
    const gridF = createCompleteElement("div", ["gridField"], "", {'data-player-id': player.id} )

    createCells(gridF, player.grid);

    boardContainer.append(header, gridF);

    return boardContainer;
}

export function markCellAsHit (attackResult, cell) {

    if(attackResult === "hit" || attackResult === "sunk") {
        cell.classList.add("hit");
    }else if(attackResult === 'miss'){
        cell.classList.add("miss");
    }
}

export function showHumanShips (playerGrid, playerBoard) { 

    playerGrid.forEach((row, i) => {
        row.forEach((cell, j) => {
            if(cell.hasShip){
                const cellEl = playerBoard.querySelector(`.cell[data-row="${i}"][data-col="${j}"]`);
                if(cellEl) cellEl.classList.add("ship-placed")
            }
        })
    })
}