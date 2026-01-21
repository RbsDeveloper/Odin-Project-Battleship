import { Player } from "./Player.js";
import { startDialog, insertSettingsForm, createSecondPlayerInput, removeSecondPlayerInput, renderGameScreen, createPlayerBoardsArea, buildShip, createShipPlacementUi, toggleActiveClassOnShips, markCellsOccupied, markShipAsPlaced } from "./ui.js";
import { attachActiveShipEventListener, attachBoardEventListener, attachFormEventListener, attachStartBtnLister } from "./events.js";

export const gameState = {
    players : [],
    mode: null,
    gamePhase: null,
    currentPlayer: 0,
    settings: null,
    activeShip: null,
    shipDirection: "horizontal"
}

export function triggerPhase(phase) {
    gameState.gamePhase = phase;
    switch(phase) {
        case "start": enterStartPhase(); break;
        case "settings": enterSettingsPhase(); break;
        case "placement": enterPlacementPhase(); break;
        case "game": enterGamePhase(); break;
    }
}

export const initGame = () => {  
    triggerPhase("start");
    const startBtn = document.getElementById("sgBtn");
    attachStartBtnLister(startBtn);
}

const enterStartPhase = () => {
    document.body.append(startDialog())
    const modal = document.getElementById("startingWindow");
    modal.show()
}

const enterSettingsPhase = () => {
    const modal = document.getElementById("startingWindow");
    const formElement = insertSettingsForm();
    modal.append(formElement);
    toggleSecondPlayerInput();
    attachFormEventListener(formElement, modal);
}

const enterPlacementPhase = () => {
    createPlayers(gameState.settings)
    setUpPlacementPhaseUi()
    //Just for tests 
    const shipContainer = document.querySelector(".shipContainer");
    attachActiveShipEventListener(shipContainer)
    const playerBoard = document.querySelector(`.board[data-player-id = '${gameState.players[gameState.currentPlayer].id}']`);
    attachBoardEventListener(playerBoard)
}

export function selectShip (shipId) {
    const previousShip = gameState.activeShip && gameState.activeShip !== shipId ? gameState.activeShip : null;
    
    const shipEl = document.getElementById(shipId);
    if(!shipEl || !shipEl.classList.contains('ship')) return
        toggleActiveClassOnShips(shipId, previousShip);
        gameState.activeShip = shipId;
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
    
    buildShip(gameState.players[0].gameboard.shipDetailsForCreation, leftFleetSelector);

    if(gameState.settings.mode === 'pvp'){
        rightFleet.append(createShipPlacementUi(gameState.players[1].id));
        const rightFleetSelector = document.querySelector(`.shipContainer[data-player-id = "${gameState.players[1].id}"]`);
        buildShip(gameState.players[1].gameboard.shipDetailsForCreation, rightFleetSelector); 
    }
}

function getBoards () {

    const boards = gameState.players.map(player => ({
        id : player.id,
        type: player.type,
        grid: player.gameboard.grid.map(row => row.map(cell => ({...cell})))
    }))

    return boards;
}
 
const createPlayers = (settings) => {
    const firstPlayer = new Player("human", settings.firstPlayerName);
    let secondPlayer;

    if(settings.mode === "pvp"){
        secondPlayer = new Player("human", settings.seconPlayerName);
    }else{
        secondPlayer = new Player("computer", "Computer");
    }

    gameState.players = [firstPlayer, secondPlayer];
}

function toggleSecondPlayerInput () {

    const fieldset = document.getElementById("btnFieldset");

    fieldset.addEventListener('change', (e) => {
        if(e.target.value === "pvp"){
            if(!document.getElementById("secondPlayerInput")){
                createSecondPlayerInput()
            }
        }else{
            removeSecondPlayerInput()
        }
    })
}

export function tryPlaceActiveShip (row, col) {
    const player = gameState.players[gameState.currentPlayer];
    const shipReference = getActiveShipFromPlayerFleet(player);

    try{    
        console.log(shipReference, gameState.shipDirection, [row, col])
        const placedCoords = player.gameboard.placeShip(shipReference, gameState.shipDirection, [row, col]);
        markCellsOccupied( player.id , placedCoords)
        if(placedCoords){
            markShipAsPlaced(gameState.activeShip);
            gameState.activeShip = null;
        }
        console.log(player.gameboard.grid);
    }catch (error){
        console.warn(error.message)
    }
}

function getActiveShipFromPlayerFleet (player) {
    const shipId = gameState.activeShip;
    if(!shipId) return null;

    return player.gameboard.fleet.find(ship => ship.id === shipId);
}
