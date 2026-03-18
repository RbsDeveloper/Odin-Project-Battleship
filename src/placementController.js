import { gameState, getCurrentPlayer } from "./gameState.js";
import { getRandomCoord, getRandomDirection } from "./utils.js";
import { toggleActiveClassOnShips, markCellsOccupied, markShipAsPlaced, resetBoardUi, resetFleetUi, enableConfirmBtn, disableConfirmBtn, updateGameMessage, resetHighlightPlacement, highlightPlacement } from "./ui/index.js";
import { recordAndGetHistory } from "./messenger.js";

export function selectShip (shipId) {
    const previousShip = gameState.activeShip && gameState.activeShip !== shipId ? gameState.activeShip : null;
    
    const shipEl = document.getElementById(shipId);
    if(!shipEl || !shipEl.classList.contains('ship')) return;
    toggleActiveClassOnShips(shipId, previousShip);
    gameState.activeShip = shipId;
    const selectionMsg = `${shipId} selected. Awaiting deployment coordinates.`;
    updateGameMessage(recordAndGetHistory('info', selectionMsg));
}

export function getActiveShipFromPlayerFleet (player) {
    const shipId = gameState.activeShip;
    if(!shipId) return null;

    return player.getBoard().fleet.find(ship => ship.id === shipId);
}

export function changeShipDirection() {
    if(gameState.shipDirection === 'horizontal'){
        gameState.shipDirection = 'vertical';
    }else if (gameState.shipDirection === 'vertical'){
        gameState.shipDirection = "horizontal";
    }
}

export function resetPlayerBoard() {
    const player = getCurrentPlayer();
    player.getBoard().reset();

    resetBoardUi(player.id, player.getBoard().grid)
    resetFleetUi(player.id)
    disableConfirmBtn()
    gameState.activeShip = null;
    gameState.shipDirection = "horizontal"
}

export function attemptShipPlacement (row, col) {
    const player = getCurrentPlayer();
    const shipReference = getActiveShipFromPlayerFleet(player);

    if (!shipReference) {
        const errorMsg = "TACTICAL ERROR: SELECT A SHIP FROM THE FLEET MANIFEST FIRST.";
        updateGameMessage(recordAndGetHistory('info', errorMsg));
        console.warn("Placement attempted without an active ship.");
        return; // Stop execution here
    }
    
    try{    
        console.log(shipReference, gameState.shipDirection, [row, col])
        const placedCoords = player.getBoard().placeShip(shipReference, gameState.shipDirection, [row, col]);
        markCellsOccupied( player.id , placedCoords);
        const successMsg = `${shipReference.id.toUpperCase()} DEPLOYED AT [${row},${col}].`;
        updateGameMessage(recordAndGetHistory('info', successMsg));
        if(placedCoords){
            markShipAsPlaced(gameState.activeShip);
            gameState.activeShip = null;
        }
        console.log(player.getBoard().grid);
    }catch (error){
        console.warn(error.message);
        updateGameMessage(recordAndGetHistory('info', `PLACEMENT FAILED: ${error.message}`));
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

export function randomizeHumanFleet () {
    resetPlayerBoard()
    const player = getCurrentPlayer()
    executeRandomPlacement(player, true)
    gameState.activeShip = null;
    if(isPlacementCompleted(player)) enableConfirmBtn();
};

export function randomizeComputerFleet () {
    const player = getCurrentPlayer()
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
    const player = getCurrentPlayer();
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
    const player = getCurrentPlayer();
    resetHighlightPlacement(player.id);
    attemptShipPlacement(row, col);
    if(isPlacementCompleted(player)) enableConfirmBtn();
}