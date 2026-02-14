import { startDialog, insertSettingsForm, renderGameScreen, createPlayerBoardsArea, buildShip, createShipPlacementUi, renderPlacementScreen, renderGameboard, markCellAsHit, renderWinnerDialog } from "./ui.js";
import { attachActiveShipEventListener, attachBoardEventListener, attachFormEventListener, attachPlacementBtnsEventListener, attachStartBtnLister, proceedToSecondPlayerPlacement, enterGamePhaseForPvC, attachComputerBoardClicks, attachEventForPvpMatch, attachEventForNewGamebtn, attachEventForPlayAgainBtn } from "./events.js";
import { createPlayers, toggleSecondPlayerInput } from "./playerSetup.js";
import { placeFleetRandomlyForCurrentPlayer, resetPlayerBoard, changeShipDirection } from "./placementController.js";
import { gameState, getBoards } from "./gameState.js";
import { delayActions, getRandomCoord, opponentIndex } from "./utils.js";

export function triggerPhase(phase) {
    gameState.gamePhase = phase;
    switch(phase) {
        case "start": enterStartPhase(); break;
        case "settings": enterSettingsPhase(); break;
        case "placement": enterPlacementPhase(); break;
        case "game": enterGamePhase(); break;
        case "winner": enterWinnerPhase(); break;
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
        pvpMatch()
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
    const opponentPlayer = gameState.players[opponentIndex(gameState.currentPlayer)];
    const computerBoard = document.querySelector(`.board[data-player-id = "${opponentPlayer.id}"]`);
    attachComputerBoardClicks(computerBoard);
}

export async function runRound (eventData) {

    const row = parseInt(eventData.getAttribute("data-row"));
    const col = parseInt(eventData.getAttribute("data-col"));
    const opponentPlayer = gameState.players[opponentIndex(gameState.currentPlayer)];
    
    const hitOrNot = opponentPlayer.getBoard().receiveAttack([row, col]);
    if(hitOrNot === null) return
    await delayActions(1000).then(()=>{
        markCellAsHit(hitOrNot, eventData);    
    })
    
    if(checkLoss(opponentPlayer)){
        triggerPhase("winner");
        return
    }

    gameState.currentPlayer = opponentIndex(gameState.currentPlayer)
    computerAttack()      
   
}
 
async function computerAttack () {
    const opponentPlayer = gameState.players[opponentIndex(gameState.currentPlayer)];
    const humanBoard = document.querySelector(`.board[data-player-id = "${opponentPlayer.id}"]`)
    let hitOrNot = null

    while (hitOrNot === null) {
        const rowTarget = getRandomCoord();
        const colTarget = getRandomCoord();

        hitOrNot = opponentPlayer.getBoard().receiveAttack([rowTarget, colTarget]);

        if(hitOrNot === null){ 
            continue
        }
            
        const targetCell = humanBoard.querySelector(`.cell[data-row = "${rowTarget}"][data-col = "${colTarget}"]`)
       
        await delayActions(1000).then(()=> {
            markCellAsHit(hitOrNot, targetCell);
        })
    }
    
    if(checkLoss(opponentPlayer)){
        triggerPhase("winner");
        return
    }
    gameState.currentPlayer = opponentIndex(gameState.currentPlayer); 
}

function pvpMatch () {
    const boardsContainer = document.getElementById("boardsArea");
    attachEventForPvpMatch(boardsContainer);
}

export async function pvpRound (eventData) {
    const activePlayer = gameState.players[gameState.currentPlayer];
    const targetedBoard = eventData.parentElement
    
    if(targetedBoard.getAttribute("data-player-id") === activePlayer.id){
        console.log('wrong board');
        return
    }

    const row = parseInt(eventData.getAttribute("data-row"));
    const col = parseInt(eventData.getAttribute("data-col"));
    const opponentPlayer = gameState.players[opponentIndex(gameState.currentPlayer)]

    const hitOrNot = opponentPlayer.getBoard().receiveAttack([row, col]);
    console.log(hitOrNot)
    if(hitOrNot === null){ 
        console.log('hit the same cell')    
        return 
    }
    
    await delayActions(1000).then(() => {
        markCellAsHit(hitOrNot, eventData);
    })
    
    
    if(checkLoss(opponentPlayer)){
        triggerPhase("winner");
        return
    }
    gameState.currentPlayer = opponentIndex(gameState.currentPlayer)
}

function checkLoss (playerToCheck) {
    return playerToCheck.getBoard().areAllShipSunk();   
}

function enterWinnerPhase () {
    const activePlayer = gameState.players[gameState.currentPlayer];
    document.body.append(renderWinnerDialog(activePlayer.id))
    document.getElementById("winnerDialog").showModal();
    const newGameBtn = document.getElementById("startNewGame");
    const playAgainBtn =  document.getElementById("restartSamePlayers");

    attachEventForNewGamebtn(newGameBtn);
    attachEventForPlayAgainBtn(playAgainBtn);
}