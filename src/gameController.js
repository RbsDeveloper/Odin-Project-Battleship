import { startDialog, insertSettingsForm, renderGameScreen, createPlayerBoardsArea, buildShip, createShipPlacementUi, renderPlacementScreen, renderGameboard, markCellAsHit, renderWinnerDialog, updateGameMessage, enableConfirmBtn, disableConfirmBtn, resetHighlightPlacement, clearPlacementComponents } from "./ui.js";
import { attachActiveShipEventListener, attachBoardEventListener, attachFormEventListener, attachPlacementBtnsEventListener, attachStartBtnLister, attachEventForNewGamebtn, attachEventForPlayAgainBtn, attachDragOverEvent, attachDropEvent, attachDragLeaveEvent, attachDragStartListener, attachConfirmBtnListener } from "./events.js";
import { createPlayers, toggleSecondPlayerInput } from "./playerSetup.js";
import { placeFleetRandomlyForCurrentPlayer, resetPlayerBoard, changeShipDirection, attemptShipPlacement, isPlacementCompleted, selectShip, handlePlacementHover, handlePlacementDrop, placeRandomFleet } from "./placementController.js";
import { gameState, getBoards } from "./gameState.js";
import { delayActions, getRandomCoord, opponentIndex } from "./utils.js";
import { playSound } from "./soundManager.js";

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
    attachStartBtnLister(startBtn, handleStartClick);
}

function handleStartClick (event){
    const button = event.target;
    button.remove();
    triggerPhase("settings")
}

function enterStartPhase () {
    document.body.append(startDialog())
    const modal = document.getElementById("startingWindow");
    modal.show()
}

function handleSubmitClick (e) {
    e.preventDefault();
    const formElement = e.target
    const formData = new FormData(formElement);
    const modal = document.getElementById("startingWindow")
    modal.close();
    modal.remove();
    gameState.settings = Object.fromEntries(formData);
    triggerPhase("placement");
}

function enterSettingsPhase () {
    const modal = document.getElementById("startingWindow");
    const formElement = insertSettingsForm();
    modal.append(formElement);
    toggleSecondPlayerInput();
    attachFormEventListener(formElement, handleSubmitClick);
}

function handlePlacementConfirmation() {
    if(gameState.settings.mode === "pvp"){
        if(gameState.currentPlayer === 0){
            gameState.currentPlayer = 1;
            disableConfirmBtn()
            clearPlacementComponents()
            initializePlacementUI()
        } else {
            triggerPhase("game");
        }
    }else {
        gameState.currentPlayer = 1;
        placeRandomFleet();
        triggerPhase("game")
    }
}

function enterPlacementPhase () {
    createPlayers(gameState.settings);
    document.body.append(renderPlacementScreen());
    initializePlacementUI()
    const confirmBtn = document.getElementById("confirmPlacementBtn");
    attachConfirmBtnListener(confirmBtn, handlePlacementConfirmation)
}

function enterGamePhase () {
    console.log("Inside game phase")
    document.body.innerHTML = "";
    document.body.append(renderGameScreen());
    createPlayerBoardsArea(getBoards());

    gameState.currentPlayer = 0;
    updateGameMessage(`Battle commenced! ${gameState.players[gameState.currentPlayer].id}, take the first shot.`);
    if(gameState.settings.mode === 'pvc'){
        singlePlayerMatch()
    }else{
        pvpMatch()
    }
}

export function handleBoardClick(targetEl) {
    const row = parseInt(targetEl.dataset.row);
    const col = parseInt(targetEl.dataset.col);
    if(gameState.gamePhase === "placement"){
        attemptShipPlacement(row, col);
        if(isPlacementCompleted(gameState.players[gameState.currentPlayer])){
            enableConfirmBtn()
        }
    }else if(gameState.gamePhase === "game"){
        processAttack(targetEl)
    }
}

export function initializePlacementUI () {
    const fleetContainer = document.getElementById("fleetPlacementControls");
    fleetContainer.append(createShipPlacementUi(gameState.players[gameState.currentPlayer].id));
    const fleetContainerSelector = document.querySelector(`.shipContainer[data-player-id = '${gameState.players[gameState.currentPlayer].id}']`);
    buildShip(gameState.players[gameState.currentPlayer].getBoard().shipDetailsForCreation, fleetContainerSelector);
    loadPlacementContainer();
    updateGameMessage(`Welcome, Admiral ${gameState.players[gameState.currentPlayer].id}. Deploy your fleet to the grid.`);     
}

export function fireActionBasedOnBtnTarget (targetBtnId) {
    if(gameState.gamePhase !== "placement") return;

    switch(targetBtnId) {
        case "shipDirectionBtn": 
            changeShipDirection(); 
            const direction = gameState.shipDirection;
            updateGameMessage(`Rotation: ${direction}.`)
            break;
        case "randomPlacementBtn": 
            placeFleetRandomlyForCurrentPlayer(); 
            updateGameMessage("Fleet deployed randomly!")
            break;
        case "resetBtn": 
            resetPlayerBoard(); 
            updateGameMessage("Board cleared. Ready for new orders.");
            break;
        
    }
}

function handleDragStart (elementId) {
    selectShip(elementId);
}

function handleDragLeave () {
    const player = gameState.players[gameState.currentPlayer];
    resetHighlightPlacement(player.id)
}

function loadPlacementContainer () {
    const interactiveBoard = document.getElementById("placementArea");
    const playerBoards = getBoards();
    interactiveBoard.append(renderGameboard(playerBoards[gameState.currentPlayer]));
    const shipContainer = document.querySelector(".shipContainer");
    attachActiveShipEventListener(shipContainer, handleDragStart)
    attachDragStartListener(shipContainer, selectShip);
    const playerBoard = document.querySelector(`.board[data-player-id = '${gameState.players[gameState.currentPlayer].id}']`);
    attachBoardEventListener(playerBoard, handleBoardClick);
    attachDragOverEvent(playerBoard, handlePlacementHover);
    attachDragLeaveEvent(playerBoard, handleDragLeave)
    attachDropEvent(playerBoard, handlePlacementDrop);
    const btnsContainer = document.querySelector(`.btnContainer[data-player-id = '${gameState.players[gameState.currentPlayer].id}']`);
    attachPlacementBtnsEventListener(btnsContainer, fireActionBasedOnBtnTarget);
}

function singlePlayerMatch () {
    const opponentPlayer = gameState.players[opponentIndex(gameState.currentPlayer)];
    const computerBoard = document.querySelector(`.board[data-player-id = "${opponentPlayer.id}"]`);
    attachBoardEventListener(computerBoard, handleBoardClick);
}

function pvpMatch () {
    const boardsContainer = document.getElementById("boardsArea");
    attachBoardEventListener(boardsContainer, handleBoardClick);
}

async function computerAttack () {
    const opponentPlayer = gameState.players[opponentIndex(gameState.currentPlayer)];
    const humanBoard = document.querySelector(`.board[data-player-id = "${opponentPlayer.id}"]`)
    const computerAttackCoords = gameState.players[gameState.currentPlayer].getNextMove();
    console.log(computerAttackCoords)

    await delayActions(1000)

        const resultOfTheAttack = opponentPlayer.getBoard().receiveAttack([computerAttackCoords.row, computerAttackCoords.col]);

       
        playSound('fire')   
        const targetCell = humanBoard.querySelector(`.cell[data-row = "${computerAttackCoords.row}"][data-col = "${computerAttackCoords.col}"]`)
       
        await delayActions(1000)
        playSound(resultOfTheAttack)
        markCellAsHit(resultOfTheAttack, targetCell);

        if(resultOfTheAttack==='hit'){
            updateGameMessage(`Boom! ${gameState.players[gameState.currentPlayer].id} scored a hit!`)
        }else if(resultOfTheAttack === 'miss') {
            updateGameMessage(`Splash!${gameState.players[gameState.currentPlayer].id} missed!`)
        }
    
    
    await delayActions(500)
    if(checkLoss(opponentPlayer)){
        triggerPhase("winner");
        gameState.isProcessingTurn = false
        return
    }
    await delayActions(1000);
    updateGameMessage(`It is now ${opponentPlayer.id}'s turn!`);
    gameState.currentPlayer = opponentIndex(gameState.currentPlayer); 
}

function checkLoss (playerToCheck) {
    return playerToCheck.getBoard().areAllShipSunk();   
}

function handleNewGame () {
    clearWindow();
    resetEntireGameState()
    initGame()
}

function handlePlayAgain () {
    clearWindow();
    resetGameStateForReplay();
    triggerPhase("placement")
}

function enterWinnerPhase () {
    const activePlayer = gameState.players[gameState.currentPlayer];
    document.body.append(renderWinnerDialog(activePlayer.id))
    document.getElementById("winnerDialog").showModal();
    const newGameBtn = document.getElementById("startNewGame");
    const playAgainBtn =  document.getElementById("restartSamePlayers");

    attachEventForNewGamebtn(newGameBtn, handleNewGame);
    attachEventForPlayAgainBtn(playAgainBtn, handlePlayAgain);
}

function processAttack(targetEl) {
    const playerBoard = targetEl.parentElement;
    const activePlayer = gameState.players[gameState.currentPlayer];
    const opponentPlayer = gameState.players[opponentIndex(gameState.currentPlayer)];
    const row = parseInt(targetEl.dataset.row);
    const col = parseInt(targetEl.dataset.col);

    //We check if we are already in the middle of an attack or not
    if(gameState.isProcessingTurn)return;
    gameState.isProcessingTurn = true;

    //We check if the click happens on the wrong board(especially for pvp);
    if(playerBoard.dataset.playerId === activePlayer.id){
        console.log("wrong board clicked")//here to know what happens, alter will refactor
        gameState.isProcessingTurn = false;
        return
    }
    handleCombatFlow(targetEl,activePlayer, opponentPlayer, row, col )
}

async function handleCombatFlow(targetEl,currentPlayer , opponent, row, col) {

    const resultOfTheAttack = opponent.getBoard().receiveAttack([row,col]);
    if(resultOfTheAttack===null){
        console.log("hit the same cell");
        gameState.isProcessingTurn = false;
        return
    }

    playSound('fire');
    await delayActions(1000);
    playSound(resultOfTheAttack);
    markCellAsHit(resultOfTheAttack, targetEl);

    if(resultOfTheAttack==='hit'){
        updateGameMessage(`Boom! ${currentPlayer.id} scored a hit!`)
    }else if(resultOfTheAttack === 'miss') {
        updateGameMessage(`Splash!${currentPlayer.id} missed!`)
    }
    
    await delayActions(500)
    if(checkLoss(opponent)){
        triggerPhase("winner");
        gameState.isProcessingTurn = false
        return
    }

    await delayActions(1000);
    gameState.currentPlayer = opponentIndex(gameState.currentPlayer);
    updateGameMessage(`It is now ${gameState.players[gameState.currentPlayer].id}'s turn!`);
    
    if(gameState.settings.mode === "pvc"){
        await computerAttack()
    }
    gameState.isProcessingTurn = false
}