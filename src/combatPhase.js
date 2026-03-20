import { renderGameScreen, createPlayerBoardsArea, markCellAsHit, renderWinnerDialog, updateGameMessage, updateShipCard, showHumanShips, renderFleetStatus, updateGameStatsHeader, updateGameStatsBody, } from "./ui/index.js";
import { attachBoardEventListener, attachClickListener} from "./events.js";
import { gameState, getBoards, getCurrentPlayer, opponentIndex } from "./gameState.js";
import { delayActions } from "./utils.js";
import { playSound } from "./soundManager.js";
import { recordAndGetHistory } from "./messenger.js";
import { triggerPhase } from "./gameController.js";
import { handleNewGame, handlePlayAgain } from "./sessionController.js";


export function enterGamePhase () {
    console.log("Inside game phase")
    document.body.innerHTML = "";
    document.body.append(renderGameScreen(gameState.players));
    createPlayerBoardsArea(getBoards(), gameState.players);
    mountFleetStatusUi(gameState.players);

    gameState.currentPlayer = 0;

    const startMsg = `Battle commenced! ${getCurrentPlayer().id}, take the first shot.`;
    const history = recordAndGetHistory('info', startMsg);
    updateGameMessage(history);
    updateGameStatsHeader(gameState.players[gameState.currentPlayer]);

    if(gameState.settings.mode === 'pvc'){
        singlePlayerMatch();

        const player = gameState.players[0]
        const humanGrid = player.getBoard().grid;
        const boardEl = document.querySelector(`.gridField[data-player-id="${player.id}"]`)
        if(!boardEl)return
        showHumanShips(humanGrid, boardEl)
    }else{
        pvpMatch()
    }
}

export function handleBoardClick(targetEl) {
    processAttack(targetEl)
}

export function singlePlayerMatch () {
    const opponentPlayer = gameState.players[opponentIndex(gameState.currentPlayer)];
    const computerBoard = document.querySelector(`.gridField[data-player-id = "${opponentPlayer.id}"]`);
    attachBoardEventListener(computerBoard, handleBoardClick);
}

export function pvpMatch () {
    const boardsContainer = document.getElementById("boardsArea");
    attachBoardEventListener(boardsContainer, handleBoardClick);
}

export async function computerAttack () {
    const opponentPlayer = gameState.players[opponentIndex(gameState.currentPlayer)];
    const humanBoard = document.querySelector(`.gridField[data-player-id = "${opponentPlayer.id}"]`)
    const computerAttackCoords = getCurrentPlayer().getNextMove();

    await delayActions(1000)

        const resultOfTheAttack = opponentPlayer.getBoard().receiveAttack([computerAttackCoords.row, computerAttackCoords.col]);
       
        playSound('fire')   
        const targetCell = humanBoard.querySelector(`.cell[data-row = "${computerAttackCoords.row}"][data-col = "${computerAttackCoords.col}"]`);
       
        await delayActions(1000)
        playSound(resultOfTheAttack)
        markCellAsHit(resultOfTheAttack, targetCell);

        if(resultOfTheAttack==='hit'){
            gameState.players[gameState.currentPlayer].hits++
            const msg = `BOOM! ${getCurrentPlayer().id} scored a hit on our fleet!`;
            updateGameMessage(recordAndGetHistory('hit', msg));
            getCurrentPlayer().addAdjacentCells(computerAttackCoords);
            updateShipsHp(opponentPlayer, computerAttackCoords.row, computerAttackCoords.col)
        }else if(resultOfTheAttack === 'miss'){
            gameState.players[gameState.currentPlayer].misses++
            const msg = `SPLASH! ${getCurrentPlayer().id} missed the target.`;
            updateGameMessage(recordAndGetHistory('miss', msg));
        }else if(resultOfTheAttack === 'sunk'){
            gameState.players[gameState.currentPlayer].hits++
            const msg = "CRITICAL DAMAGE! ONE OF OUR SHIPS HAS BEEN SUNK!";
            updateGameMessage(recordAndGetHistory('sunk', msg));
            getCurrentPlayer().clearTargetingQueue();
            updateShipsHp(opponentPlayer, computerAttackCoords.row, computerAttackCoords.col)
        }
        updateGameStatsBody(gameState.players[gameState.currentPlayer], resultOfTheAttack)

    await delayActions(500)
    if(checkLoss(opponentPlayer)){
        triggerPhase("winner");
        gameState.isProcessingTurn = false
        return
    }
    await delayActions(1000);
    const turnMsg = `IT IS NOW ${opponentPlayer.id}'S TURN!`;
    updateGameMessage(recordAndGetHistory('info', turnMsg));
    

    gameState.currentPlayer = opponentIndex(gameState.currentPlayer);
    updateGameStatsHeader(gameState.players[gameState.currentPlayer]) 
}

async function handleCombatFlow(targetEl,currentPlayer , opponent, row, col) {

    const resultOfTheAttack = opponent.getBoard().receiveAttack([row,col]);
    if(resultOfTheAttack===null){
        updateGameMessage(recordAndGetHistory('info', "Target coordinates already engaged."));
        gameState.isProcessingTurn = false;
        return
    }

    playSound('fire');
    await delayActions(1000);
    playSound(resultOfTheAttack);
    markCellAsHit(resultOfTheAttack, targetEl);

    if(resultOfTheAttack==='hit'){
        currentPlayer.hits++
        const msg = `BOOM! ${currentPlayer.id} scored a hit!`;
        updateGameMessage(recordAndGetHistory('hit', msg));
        updateShipsHp(opponent, row, col)
    }else if(resultOfTheAttack === 'miss') {
        currentPlayer.misses++
        const msg = `SPLASH! ${currentPlayer.id} missed!`;
        updateGameMessage(recordAndGetHistory('miss', msg));
    }else if(resultOfTheAttack === "sunk"){
        currentPlayer.hits++
        const msg = `DIRECT HIT! ADMIRAL ${currentPlayer.id} HAS SUNK AN ENEMY VESSEL!`;
        updateGameMessage(recordAndGetHistory('sunk', msg));
        updateShipsHp(opponent, row, col)
    }
    updateGameStatsBody(currentPlayer, resultOfTheAttack)
    
    await delayActions(500)
    if(checkLoss(opponent)){
        triggerPhase("winner");
        gameState.isProcessingTurn = false
        return
    }

    await delayActions(1000);
    gameState.currentPlayer = opponentIndex(gameState.currentPlayer);
    const turnMsg = `IT IS NOW ${getCurrentPlayer().id}'S TURN!`;
    updateGameMessage(recordAndGetHistory('info', turnMsg));
    updateGameStatsHeader(gameState.players[gameState.currentPlayer])
    
    if(gameState.settings.mode === "pvc"){
        await computerAttack()
    }
    gameState.isProcessingTurn = false
}

function processAttack(targetEl) {
    const playerBoard = targetEl.parentElement;
    const activePlayer = getCurrentPlayer();
    const opponentPlayer = gameState.players[opponentIndex(gameState.currentPlayer)];
    const row = parseInt(targetEl.dataset.row);
    const col = parseInt(targetEl.dataset.col);

    if(gameState.isProcessingTurn)return;
    gameState.isProcessingTurn = true;

    
    if(playerBoard.dataset.playerId === activePlayer.id){
        gameState.isProcessingTurn = false;
        return
    }
    handleCombatFlow(targetEl,activePlayer, opponentPlayer, row, col ) 
}

function mountFleetStatusUi(players) {
    players.forEach(player => {
        const destination = document.querySelector(`.fleetContainer[data-player-id= "${player.id}"]`);
        renderFleetStatus(player, destination)
    })
}

function updateShipsHp (opponent, row, col) {
    const shipToSearch = opponent.getBoard().grid[row][col].shipReference;
    const card = document.querySelector(`.fleetContainer[data-player-id="${opponent.id}"] .shipCard[data-ship-id="${shipToSearch.id}"]`);
    const hpPoints = card.querySelector(".hpPoints");
    const lifePoints = card.querySelectorAll(".hpPoint");
    updateShipCard(hpPoints, lifePoints);
}

function checkLoss (playerToCheck) {
    return playerToCheck.getBoard().areAllShipSunk();   
}

export function enterWinnerPhase () {
    const activePlayer = getCurrentPlayer();
    document.body.append(renderWinnerDialog(activePlayer.id))
    document.getElementById("winnerDialog").showModal();
    const newGameBtn = document.getElementById("startNewGame");
    const playAgainBtn =  document.getElementById("restartSamePlayers");

    attachClickListener(newGameBtn, handleNewGame);
    attachClickListener(playAgainBtn, handlePlayAgain);
}