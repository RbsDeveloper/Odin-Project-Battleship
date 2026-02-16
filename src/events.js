import { gameState, resetEntireGameState, resetGameStateForReplay } from "./gameState.js";
import { fireActionBasedOnBtnTarget, initGame, initializePlacementUI, pvpRound, runRound, triggerPhase } from "./gameController.js";
import { isPlacementCompleted, selectShip, placeRandomFleet, attemptShipPlacement, getActiveShipFromPlayerFleet } from "./placementController.js";
import { clearPlacementComponents, clearWindow, disableConfirmBtn, enableConfirmBtn, highlightPlacement, renderGameScreen, resetHighlightPlacement } from "./ui.js";
import { getGhostCoords, getValidPlacementCoords } from "./Gameboard.js";

export function attachStartBtnLister (element) {
    
    element.addEventListener("click", () => {   
        element.remove();
        triggerPhase("settings");
    })
}

export function attachFormEventListener (element, elementToRemove) {
    element.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(element);
        elementToRemove.close();
        elementToRemove.remove();
        gameState.settings = Object.fromEntries(formData);
        triggerPhase("placement");
    })
}

export function attachActiveShipEventListener (element) {
    element.addEventListener("click", (event) => {
        const targetEl = event.target;
        if(targetEl.classList.contains("ship")){
            console.log(event.target)
            selectShip(targetEl.id);
        }
    })
}

export function attachBoardEventListener (element) {
    element.addEventListener("click", (event) => {
        
        const row = parseInt(event.target.getAttribute("data-row"));
        const col = parseInt(event.target.getAttribute("data-col"));
        console.log(row, col)
        attemptShipPlacement(row, col);
        if(isPlacementCompleted(gameState.players[gameState.currentPlayer])) enableConfirmBtn();
    })
}

export function attachPlacementBtnsEventListener (element) {
    element.addEventListener("click", (event) => {
        console.log(event)
        let target = event.target;
        if(target.id){
            console.log("it has an Id");
            fireActionBasedOnBtnTarget(target.id);
        }else{
            console.log("No Id here");
        }
    })
}

export function proceedToSecondPlayerPlacement (element) {
    element.addEventListener("click", ()=> {
        console.log("clicked")
        gameState.currentPlayer = 1;
        disableConfirmBtn()
        clearPlacementComponents()
        initializePlacementUI()
        enterGamePhaseForPvP(element)
    },
{once: true})
}

function enterGamePhaseForPvP (element) {
    element.addEventListener("click", ()=> {
        triggerPhase("game");
    })
}

export function enterGamePhaseForPvC (element) {
    element.addEventListener("click", ()=> {
        gameState.currentPlayer = 1;
        placeRandomFleet();
        triggerPhase("game");
    })
}

export function attachComputerBoardClicks (element) {
    element.addEventListener("click", (e) => {
        runRound(e.target)
    })
}

export function attachEventForPvpMatch (element) {
    element.addEventListener("click", (event) => {
        console.log(event.target);
        pvpRound(event.target);
    })
}

export function attachEventForNewGamebtn (element) {
    element.addEventListener("click", () => {
        clearWindow();
        resetEntireGameState()
        initGame()
    })
}

export function attachEventForPlayAgainBtn (element) {
    element.addEventListener("click", () => {
        clearWindow();
        resetGameStateForReplay();
        triggerPhase("placement")
    })
}

export function attachDragEvent (element) {
    element.addEventListener('dragstart', (event) => {

        const draggedElement = event.target

        if(draggedElement.classList.contains("ship")){
            console.log('dragging')
            console.log(draggedElement);
            selectShip(draggedElement.id)
        }
    })
}

export function attachDragOverEvent (element) {
    element.addEventListener('dragover', (event) => {
        event.preventDefault();
        const cell = event.target.closest(".cell");
        if(!cell) return
        const cellRow = parseInt(cell.getAttribute("data-row"));
        const cellCol = parseInt(cell.getAttribute("data-col"));

        //obtaining active ship : 
        const player = gameState.players[gameState.currentPlayer];
        const shipReference = getActiveShipFromPlayerFleet(player);
        
        resetHighlightPlacement(player.id);

        const ghostCoords = getGhostCoords(shipReference, gameState.shipDirection, [cellRow, cellCol]);
        const coords = getValidPlacementCoords(shipReference, gameState.shipDirection, [cellRow, cellCol], player.getBoard().grid)

        if(coords){
            highlightPlacement(player.id, coords, true);
        }else{
            highlightPlacement(player.id, ghostCoords, false);
        }
        
    })
}

export function attachDragLeaveEvent (element) {
    element.addEventListener('dragleave', () => {
        const player = gameState.players[gameState.currentPlayer];
        resetHighlightPlacement(player.id)
    })
}

export function attachDropEvent (element) {
    element.addEventListener("drop", (event)=> {
        event.preventDefault()
        const cell = event.target.closest(".cell");
        
        if(!cell) return
        const cellRow = parseInt(cell.getAttribute("data-row"));
        const cellCol = parseInt(cell.getAttribute("data-col"));
        
        resetHighlightPlacement(gameState.players[gameState.currentPlayer].id);
        attemptShipPlacement(cellRow, cellCol);
        if(isPlacementCompleted(gameState.players[gameState.currentPlayer])) enableConfirmBtn();
    })
}
