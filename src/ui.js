import { gameState } from "./gameState.js";
import { createCompleteElement, getOpponentIdxForBoardMarking } from "./utils.js";

//FUNCTION THAT CREATES THE START GAME DIALOG
export function startDialog () {
    const dialogEl = createCompleteElement("dialog", ["startingDialog"], "", {id: "startingWindow"});
    const gameTitle = createCompleteElement("h1", ["gameTitle"], "Battleship");
    const startGameBtn = createCompleteElement('button', ["btn", "startGameBtn"], "Start Game", {id: "sgBtn"});
    
    dialogEl.append(gameTitle, startGameBtn);

    return dialogEl
}

//FUNCTION THAT CREATES THE SETTINGS GAME DIALOG
export function insertSettingsForm () {
    const formEl = createCompleteElement("form", ["settingsForm"], "", {id: "gameSettingsForm"});

    //elements inside the form

    //radio inputs for players
    const gameModeFieldset = createCompleteElement('fieldset', ["btnFieldset"], "", {id: "btnFieldset"});
    const legend =  createCompleteElement('legend', [], "Choose your opponent")
    const firstLabel = createCompleteElement("label", [], "Player vs Computer", {for: "pvcMode"});
    const firstInput = createCompleteElement("input", [], "", {type: "radio", value: "pvc", id: "pvcMode", name: "mode",});
    firstInput.checked = true;
    const secondLabel = createCompleteElement("label", [], "Player vs Player", {for: "pvpMode"});
    const secondInput = createCompleteElement("input", [], "", {type: "radio", value: "pvp", id: "pvpMode", name: "mode",});

    gameModeFieldset.append(legend, firstLabel, firstInput, secondLabel, secondInput);

    //Name input
    const fieldSetForNames = createCompleteElement("fieldset", ['pnFieldset'], "", {id: "nameFieldset"})
    const thirdLabel = createCompleteElement("label", [], "Player name:", {for: "firstPlayerInput"});
    const nameInput = createCompleteElement("input", [], "", {type: "text", name: "firstPlayerName", id:"firstPlayerInput",});
    nameInput.required = true;
    fieldSetForNames.append(thirdLabel, nameInput);

    const submitBtn = createCompleteElement("button", ["btn", "formSubmitBtn"], "Next", {type: "submit"});

    formEl.append(gameModeFieldset, fieldSetForNames, submitBtn);

    return formEl;

}
//FUNCTION THAT CREATES AND INSERTS THE SECOND NAME INPUT BASED ON THE GAME MODE
export function createSecondPlayerInput () {
    const nameFieldset = document.getElementById("nameFieldset");

    const label = createCompleteElement("label", [], "Second player name:", {id: "secondPlayerLabel", for: "secondPlayerInput"});
    const secondNameInput = createCompleteElement("input", [], "", {type: "text", id:"secondPlayerInput", name: "secondPlayerInput",})
    secondNameInput.required = true;
    nameFieldset.append(label, secondNameInput);
}
//FUNCTION THAT REMOVES THE SECOND NAME INPUT
export function removeSecondPlayerInput () {
     document.getElementById("secondPlayerLabel")?.remove();
     document.getElementById("secondPlayerInput")?.remove();
}

//FUNCTION THAT CREATES THE GAME SCREEN OR ARENA
export function renderGameScreen () {
    const mainContainer = createCompleteElement("main", [], "",);

    const leftFleetContainer = createCompleteElement("div", ["fleetContainer"], "", {id: "leftFleet"});
    const middleContainer = createCompleteElement("div", ["gameboardsContainer"], "", {id: "boardsArea"})
    const rightFleetContainer = createCompleteElement("div", ["fleetContainer"],"", {id: "rightFleet"});
    
    mainContainer.append(leftFleetContainer, middleContainer, rightFleetContainer);

    return mainContainer
}

//creates the boards for both players inside the boardArea, best for the game phase
export function createPlayerBoardsArea  (boardsData) {
    const boardsDestination = document.getElementById("boardsArea");
    
    boardsData.forEach(playerGrid => {
        boardsDestination.append(renderGameboard(playerGrid));
    });
}

//creates placement scree

export function renderPlacementScreen () {
    const mainContainer = createCompleteElement("main", [], "",);
    const messageContainer = createCompleteElement("div", ["msgContainer"], "", {id: "msgWrapper"});
    const interactiveArea = createCompleteElement("div", ["interactiveContainer"], "", {id: "interactiveZone"})

    const fleetPlacementContainer = createCompleteElement("div", ["fleetContainer"], "", {id: "fleetPlacementControls"});
    const gridContainer = createCompleteElement("div", ["placementBoardContainer"], "", {id: "placementArea"})
    const confirmPlacementBtn = createCompleteElement("button", ["btn", "confirmBtn"], "Confirm Placement", {id: "confirmPlacementBtn", disabled: true});
    interactiveArea.append(fleetPlacementContainer, gridContainer, confirmPlacementBtn);
    mainContainer.append(messageContainer, interactiveArea);

    return mainContainer;
}

export function buildShip (shipDetails, destination) {

    shipDetails.forEach(item => {
        const build = createCompleteElement("div", ["ship"], `${item.id}`, {id: `${item.id}`});
        destination.append(build);
    })   
}
//creates the container where the ships and btn controlls are stored for placement
export function createShipPlacementUi  (identityParam) {
    const placementContainer = createCompleteElement("div", ["placementContainer"]);
    const fleetSelector = createCompleteElement("div", ["shipContainer"], "", {"data-player-id": `${identityParam}`});
    const placementControls = createCompleteElement("div", ["btnContainer"], "", {"data-player-id": `${identityParam}`});

    const rotateShipsBtn = createCompleteElement("button", ["btn", "directionBtn"] , "Horizontal", {id: "shipDirectionBtn"});
    const randomPlacementBtn = createCompleteElement("button", ["btn", "randomBtn"], "Random placement", {id: "randomPlacementBtn"});
    const resetPlacementBtn = createCompleteElement("button", ["btn", "resetBtn"], "Reset", {id: "resetBtn"});

    placementControls.append(rotateShipsBtn, randomPlacementBtn, resetPlacementBtn);
    placementContainer.append(fleetSelector, placementControls);

    return placementContainer
}

//Creates a grid or board
export function renderGameboard (grid) {

    const boardContainer = createCompleteElement('div', ['board'], '', {'data-player-id': grid.id})

    createCells(boardContainer, grid.grid);

    return boardContainer;
}

function createCells (container, board) {
    for(let i = 0 ; i < board.length; i++){

        for(let j = 0; j < board[i].length ; j++){

            const cell = createCompleteElement('div', ['cell'], '', {"data-row": `${i}`, "data-col": `${j}`})

            container.append(cell);

        }

    }
}

export function toggleActiveClassOnShips(newActive, oldShip = null) {
    if (oldShip) {
        document.getElementById(oldShip).classList.remove("active");
    }
    document.getElementById(newActive).classList.add("active");
}

export function markCellsOccupied (playerId, coords) {
    coords.forEach(([r , c]) => {
        const cell = document.querySelector(`.board[data-player-id = '${playerId}'] .cell[data-row='${r}'][data-col='${c}']`)
        cell.classList.add("ship-placed");
    })
}

export function markShipAsPlaced (shipId) {
    const shipEl = document.getElementById(shipId);
    if(shipEl){
        shipEl.classList.add("placed");
        shipEl.classList.remove("active");
    }
}

export function resetBoardUi (playerId, boardsDetails) {
    const targetBoard = document.querySelector(`.board[data-player-id = '${playerId}']`);
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

export function enableConfirmBtn () {
    const confirmBtn = document.getElementById("confirmPlacementBtn");
    confirmBtn.disabled = false
}

export function disableConfirmBtn () {
    const confirmBtn = document.getElementById("confirmPlacementBtn");
    if(!confirmBtn.disabled) confirmBtn.disabled = true;
}
  
export function clearPlacementComponents () {
    const fleetContainer = document.getElementById("fleetPlacementControls");
    fleetContainer.innerHTML = "";
    const interactiveBoards = document.getElementById("placementArea");
    interactiveBoards.innerHTML = ""

}

export function markCellAsHit (attackResult, cell) {

    if(attackResult === "hit") {
        cell.classList.add("hit");
    }else if(attackResult === 'miss'){
        cell.classList.add("miss");
    }
}