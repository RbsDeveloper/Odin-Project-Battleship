import { gameState } from "./gameState.js";
import { getRandomCoord, getRandomDirection } from "./utils.js";
import { toggleActiveClassOnShips, markCellsOccupied, markShipAsPlaced, resetBoardUi, resetFleetUi, enableConfirmBtn, disableConfirmBtn, updateGameMessage, resetHighlightPlacement, highlightPlacement } from "./ui.js";

export function selectShip (shipId) {
    const previousShip = gameState.activeShip && gameState.activeShip !== shipId ? gameState.activeShip : null;
    
    const shipEl = document.getElementById(shipId);
    if(!shipEl || !shipEl.classList.contains('ship')) return;
    toggleActiveClassOnShips(shipId, previousShip);
    gameState.activeShip = shipId;
    updateGameMessage(`${shipId} selected. Awaiting deployment coordinates.`)
}

export function getActiveShipFromPlayerFleet (player) {
    const shipId = gameState.activeShip;
    if(!shipId) return null;

    return player.getBoard().fleet.find(ship => ship.id === shipId);
}

export function changeShipDirection() {
    const btn = document.querySelector(".directionBtn");
    if(gameState.shipDirection === 'horizontal'){
        gameState.shipDirection = 'vertical';
        btn.innerText = 'vertical'
    }else{
        gameState.shipDirection = "horizontal";
        btn.innerText = "horizontal"
    }
}

export function resetPlayerBoard() {
    const player = gameState.players[gameState.currentPlayer];
    player.getBoard().reset();

    resetBoardUi(player.id, player.getBoard().grid)
    resetFleetUi(player.id)
    disableConfirmBtn()
    gameState.activeShip = null;
}

export function attemptShipPlacement (row, col) {
    const player = gameState.players[gameState.currentPlayer];
    const shipReference = getActiveShipFromPlayerFleet(player);
    
    try{    
        console.log(shipReference, gameState.shipDirection, [row, col])
        const placedCoords = player.getBoard().placeShip(shipReference, gameState.shipDirection, [row, col]);
        markCellsOccupied( player.id , placedCoords);
        updateGameMessage(`Nice spot! Ship placed.`);
        if(placedCoords){
            markShipAsPlaced(gameState.activeShip);
            gameState.activeShip = null;
        }
        console.log(player.getBoard().grid);
    }catch (error){
        console.warn(error.message);
        updateGameMessage(`${error.message}`);
    }
}

function executeRandomPlacement(player, updateUi = false) {
    const playerFleet = player.getBoard().fleet;
    
    for(const boat of playerFleet){
        let placed = false;

        while(placed === false){
            const direction = getRandomDirection()
            const rowCoord = getRandomCoord();
            const colCoord = getRandomCoord();

            gameState.activeShip = boat.id;
            gameState.shipDirection = direction;

            try {
                const placedCoords = player.getBoard().placeShip(boat, gameState.shipDirection, [rowCoord, colCoord]);
                if(updateUi){
                    markCellsOccupied( player.id , placedCoords)
                    markShipAsPlaced(gameState.activeShip);
                }
                  
                placed = true;
            }catch (err) { 
                // invalid placement, try again
            }
        }
    }
}

//Used for the placeRandomFleet BTN
export function randomizeHumanFleet () {
    resetPlayerBoard()
    const player = gameState.players[gameState.currentPlayer]
    executeRandomPlacement(player, true)
    gameState.activeShip = null;
    if(isPlacementCompleted(player)) enableConfirmBtn();
};

//Used as a random fleet placement for the CPU
export function randomizeComputerFleet () {
    const player = gameState.players[gameState.currentPlayer]
    executeRandomPlacement(player);
    gameState.activeShip = null;
}

export function isPlacementCompleted (player) {
    const fleetToCheck = player.getBoard().fleet;
    
    for(const boat of fleetToCheck){
        if(boat.isPlaced === false) return false;
    }

    return true
}

export function handlePlacementHover (row, col) {
    const player = gameState.players[gameState.currentPlayer];
    const ship = getActiveShipFromPlayerFleet(player);

    if(!ship) return;

    resetHighlightPlacement(player.id);

    const ghostCoords = player.getBoard().getPreviewCoords(ship, gameState.shipDirection, [row, col]);
    const coords = player.getBoard().getValidPlacement(ship, gameState.shipDirection, [row, col]);

    if(coords){
        highlightPlacement(player.id, coords, true);
    }else{
        highlightPlacement(player.id, ghostCoords, false);
    }
}

export function handlePlacementDrop (row, col){
    const player = gameState.players[gameState.currentPlayer];
    resetHighlightPlacement(player.id);
    attemptShipPlacement(row, col);
    if(isPlacementCompleted(player)) enableConfirmBtn();
}