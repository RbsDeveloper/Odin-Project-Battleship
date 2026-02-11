import { startDialog, insertSettingsForm, renderGameScreen, createPlayerBoardsArea, buildShip, createShipPlacementUi, renderPlacementScreen, renderGameboard, markCellAsHit } from "./ui.js";
import { attachActiveShipEventListener, attachBoardEventListener, attachFormEventListener, attachPlacementBtnsEventListener, attachStartBtnLister, proceedToSecondPlayerPlacement, enterGamePhaseForPvC, attachComputerBoardClicks } from "./events.js";
import { createPlayers, toggleSecondPlayerInput } from "./playerSetup.js";
import { placeFleetRandomlyForCurrentPlayer, resetPlayerBoard, changeShipDirection } from "./placementController.js";
import { gameState, getBoards } from "./gameState.js";
import { getRandomCoord } from "./utils.js";

export function triggerPhase(phase) {
    gameState.gamePhase = phase;
    switch(phase) {
        case "start": enterStartPhase(); break;
        case "settings": enterSettingsPhase(); break;
        case "placement": enterPlacementPhase(); break;
        case "game": enterGamePhase(); break;
    }
}

export function initGame () {  
    triggerPhase("start");
    const startBtn = document.getElementById("sgBtn");
    attachStartBtnLister(startBtn);
}

function enterStartPhase () {
    document.body.append(startDialog())
    const modal = document.getElementById("startingWindow");
    modal.show()
}

function enterSettingsPhase () {
    const modal = document.getElementById("startingWindow");
    const formElement = insertSettingsForm();
    modal.append(formElement);
    toggleSecondPlayerInput();
    attachFormEventListener(formElement, modal);
}

function enterPlacementPhase () {
    createPlayers(gameState.settings);
    document.body.append(renderPlacementScreen());
    initializePlacementUI()
    
    const confirmBtn = document.getElementById("confirmPlacementBtn");

    if(gameState.settings.mode === "pvp"){
        proceedToSecondPlayerPlacement(confirmBtn);
    }else{
        enterGamePhaseForPvC(confirmBtn)
    }
}

function enterGamePhase () {
    console.log("Inside game phase")
    document.body.innerHTML = "";
    document.body.append(renderGameScreen());
    createPlayerBoardsArea(getBoards());

    gameState.currentPlayer = 0;

    if(gameState.settings.mode === 'pvc'){
        singlePlayerMatch()
    }else{

    }
}

export function initializePlacementUI () {
    const fleetContainer = document.getElementById("fleetPlacementControls");
    fleetContainer.append(createShipPlacementUi(gameState.players[gameState.currentPlayer].id));
    const fleetContainerSelector = document.querySelector(`.shipContainer[data-player-id = '${gameState.players[gameState.currentPlayer].id}']`);
    buildShip(gameState.players[gameState.currentPlayer].getBoard().shipDetailsForCreation, fleetContainerSelector);
    loadPlacementContainer();     
}

export function fireActionBasedOnBtnTarget (targetBtnId) {
    if(gameState.gamePhase !== "placement") return;

    switch(targetBtnId) {
        case "shipDirectionBtn": changeShipDirection(); break;
        case "randomPlacementBtn": placeFleetRandomlyForCurrentPlayer(); break;
        case "resetBtn": resetPlayerBoard(); break;
        
    }
}

function loadPlacementContainer () {
    const interactiveBoard = document.getElementById("placementArea");
    const playerBoards = getBoards();
    interactiveBoard.append(renderGameboard(playerBoards[gameState.currentPlayer]));
    const shipContainer = document.querySelector(".shipContainer");
    attachActiveShipEventListener(shipContainer)
    const playerBoard = document.querySelector(`.board[data-player-id = '${gameState.players[gameState.currentPlayer].id}']`);
    attachBoardEventListener(playerBoard);
    const btnsContainer = document.querySelector(`.btnContainer[data-player-id = '${gameState.players[gameState.currentPlayer].id}']`);
    attachPlacementBtnsEventListener(btnsContainer);
}

function singlePlayerMatch () {
    const computerBoard = document.querySelector(`.board[data-player-id = "${gameState.players[1].id}"]`);
    attachComputerBoardClicks(computerBoard);
}

export function runRound (eventData) {

    const row = parseInt(eventData.getAttribute("data-row"));
    const col = parseInt(eventData.getAttribute("data-col"));
    
    const hitOrNot = gameState.players[1].getBoard().receiveAttack([row, col]);
    if(hitOrNot === null) return
    markCellAsHit(hitOrNot, eventData);
    gameState.currentPlayer[1]
    computerAttack()      
   
}
 
function computerAttack () {
    
    const humanBoard = document.querySelector(`.board[data-player-id = "${gameState.players[0].id}"]`)
    
    let hitOrNot = null

    while (hitOrNot === null) {
        const rowTarget = getRandomCoord();
        const colTarget = getRandomCoord();

        hitOrNot = gameState.players[0].getBoard().receiveAttack([rowTarget, colTarget]);

        if(hitOrNot === null){ 
            continue
        }
            
        const targetCell = humanBoard.querySelector(`.cell[data-row = "${rowTarget}"][data-col = "${colTarget}"]`)
        markCellAsHit(hitOrNot, targetCell)
        
    }
    gameState.currentPlayer = 0;
    
}