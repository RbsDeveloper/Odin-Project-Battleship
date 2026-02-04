import { startDialog, insertSettingsForm, renderGameScreen, createPlayerBoardsArea, buildShip, createShipPlacementUi } from "./ui.js";
import { attachActiveShipEventListener, attachBoardEventListener, attachFormEventListener, attachPlacementBtnsEventListener, attachStartBtnLister } from "./events.js";
import { createPlayers, toggleSecondPlayerInput } from "./playerSetup.js";
import { placeFleetRandomly, resetPlayerBoard, changeShipDirection } from "./placementController.js";
import { gameState, getBoards } from "./gameState.js";

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
    createPlayers(gameState.settings)
    setUpPlacementPhaseUi()
    //Just for tests 
    const shipContainer = document.querySelector(".shipContainer");
    attachActiveShipEventListener(shipContainer)
    const playerBoard = document.querySelector(`.board[data-player-id = '${gameState.players[gameState.currentPlayer].id}']`);
    attachBoardEventListener(playerBoard);
    const btnsContainer = document.querySelector(`.btnContainer[data-player-id = '${gameState.players[gameState.currentPlayer].id}']`);
    attachPlacementBtnsEventListener(btnsContainer);
}

function setUpPlacementPhaseUi () {
    //we create the player instances
    const boardsInfo = getBoards();
    //we append the general layout and the boards for both players
    document.body.append(renderGameScreen());
    createPlayerBoardsArea(boardsInfo);
    //we populate the fleetContainers now
    
    const leftFleet = document.getElementById("leftFleet");
    const rightFleet = document.getElementById("rightFleet");
    
    leftFleet.append(createShipPlacementUi(gameState.players[0].id));
    const leftFleetSelector = document.querySelector(`.shipContainer[data-player-id = '${gameState.players[0].id}']`);
    
    buildShip(gameState.players[0].getBoard().shipDetailsForCreation, leftFleetSelector);

    if(gameState.settings.mode === 'pvp'){
        rightFleet.append(createShipPlacementUi(gameState.players[1].id));
        const rightFleetSelector = document.querySelector(`.shipContainer[data-player-id = "${gameState.players[1].id}"]`);
        buildShip(gameState.players[1].getBoard().shipDetailsForCreation, rightFleetSelector); 
    }
}

export function fireActionBasedOnBtnTarget (targetBtnId) {
    if(gameState.gamePhase !== "placement") return;

    switch(targetBtnId) {
        case "shipDirectionBtn": changeShipDirection(); break;
        case "randomPlacementBtn": placeFleetRandomly(); break;
        case "resetBtn": resetPlayerBoard(); break;
        //case "confirmPlacementBtn": confirmShipsPLacement(); break;
    }
}

