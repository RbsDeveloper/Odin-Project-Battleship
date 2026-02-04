import { Player } from "./Player.js";
import { startDialog, insertSettingsForm, createSecondPlayerInput, removeSecondPlayerInput, renderGameScreen, createPlayerBoardsArea, buildShip, createShipPlacementUi, toggleActiveClassOnShips, markCellsOccupied, markShipAsPlaced, resetBoardUi, resetFleetUi} from "./ui.js";
import { attachActiveShipEventListener, attachBoardEventListener, attachFormEventListener, attachPlacementBtnsEventListener, attachStartBtnLister } from "./events.js";
import { getRandomCoord, getRandomDirection } from "./utils.js";


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
    
    buildShip(gameState.players[0].getBoard().shipDetailsForCreation, leftFleetSelector);

    if(gameState.settings.mode === 'pvp'){
        rightFleet.append(createShipPlacementUi(gameState.players[1].id));
        const rightFleetSelector = document.querySelector(`.shipContainer[data-player-id = "${gameState.players[1].id}"]`);
        buildShip(gameState.players[1].getBoard().shipDetailsForCreation, rightFleetSelector); 
    }
}

function getBoards () {

    const boards = gameState.players.map(player => ({
        id : player.id,
        type: player.type,
        grid: player.getBoard().grid.map(row => row.map(cell => ({...cell})))
    }))

    return boards;
}
 
function createPlayers (settings) {
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
    console.log(shipReference)

    try{    
        console.log(shipReference, gameState.shipDirection, [row, col])
        const placedCoords = player.getBoard().placeShip(shipReference, gameState.shipDirection, [row, col]);
        markCellsOccupied( player.id , placedCoords)
        if(placedCoords){
            markShipAsPlaced(gameState.activeShip);
            gameState.activeShip = null;
        }
        console.log(player.getBoard().grid);
    }catch (error){
        console.warn(error.message)
    }
}

export function fireActionBasedOnBtnTarget (targetBtnId) {
    if(gameState.gamePhase !== "placement") return;

    switch(targetBtnId) {
        case "shipDirectionBtn": changeShipDirection(); break;
        case "randomPlacementBtn": placeFleetRandomly(); break;
        case "resetBtn": resetPlayerBoard(); break;
        case "confirmPlacementBtn": confirmShipsPLacement(); break;
    }
}

function getActiveShipFromPlayerFleet (player) {
    const shipId = gameState.activeShip;
    if(!shipId) return null;

    return player.getBoard().fleet.find(ship => ship.id === shipId);
}

function changeShipDirection() {
    const btn = document.querySelector(".directionBtn");
    if(gameState.shipDirection === 'horizontal'){
        gameState.shipDirection = 'vertical';
        btn.innerText = 'vertical'
    }else{
        gameState.shipDirection = "horizontal";
        btn.innerText = "horizontal"
    }
}

function resetPlayerBoard() {
    const player = gameState.players[gameState.currentPlayer];
    player.clearGameboard();

    resetBoardUi(player.id, player.getBoard().grid)
    resetFleetUi(player.id)
    
    gameState.activeShip = null;
}

function placeFleetRandomly () {
    resetPlayerBoard()
    const playerFleet = gameState.players[gameState.currentPlayer].getBoard().fleet;

    for(const boat of playerFleet){
        let placed = false;
        const activePlayer = gameState.players[gameState.currentPlayer]

        while(placed === false){
            const direction = getRandomDirection()
            const rowCoord = getRandomCoord();
            const colCoord = getRandomCoord();

            gameState.activeShip = boat.id;
            gameState.shipDirection = direction;

            try {
                const placedCoords = activePlayer.getBoard().placeShip(boat, gameState.shipDirection, [rowCoord, colCoord]);
                markCellsOccupied( activePlayer.id , placedCoords)
                if(placedCoords){
                    markShipAsPlaced(gameState.activeShip);
                    gameState.activeShip = null;
                }
                placed = true;
            }catch (err) { 
                // invalid placement, try again
            }
        }
    }
}
