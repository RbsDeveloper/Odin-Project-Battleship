import { Player } from "./Player.js";
import { startDialog, insertSettingsForm, createSecondPlayerInput, removeSecondPlayerInput, renderGameScreen, createPlayerBoardsArea, buildShip, createShipPlacementUi, toggleActiveClassOnShips } from "./ui.js";
import { attachActiveShipEventListener, attachFormEventListener, attachStartBtnLister } from "./events.js";

export const gameState = {
    players : [],
    mode: null,
    gamePhase: null,
    currentPLayer: 0,
    settings: null,
    activeShip: null,
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
}

export function selectShip (shipId) {
    const previousShip = gameState.activeShip && gameState.activeShip !== shipId ? gameState.activeShip : null;
    
    const shipEl = document.getElementById(shipId);
    if(!shipEl || !shipEl.classList.contains('ship')) return
        toggleActiveClassOnShips(shipId, previousShip);
        gameState.activeShip = shipId;
        
}

/*PLACEMENT LOGIC

    create an eventListener over the ship container
    it will check the e.target. 
    it checks the state first to see if there is another active ship
      if there isn't: 
        it sets the clicked ship to active in the state
        it will add an active data attribute
        it will add an activ class.
      if there is: 
        it will remove the data attribute of the active class
        it will remove also the class 
        it will change the activeship state
        and will add to the new one the class etc. 


*/

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
