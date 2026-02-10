import { gameState } from "./gameState.js";
import { getRandomCoord, getRandomDirection } from "./utils.js";
import { toggleActiveClassOnShips, markCellsOccupied, markShipAsPlaced, resetBoardUi, resetFleetUi, enableConfirmBtn, disableConfirmBtn } from "./ui.js";



export function selectShip (shipId) {
    const previousShip = gameState.activeShip && gameState.activeShip !== shipId ? gameState.activeShip : null;
    
    const shipEl = document.getElementById(shipId);
    if(!shipEl || !shipEl.classList.contains('ship')) return;
    toggleActiveClassOnShips(shipId, previousShip);
    gameState.activeShip = shipId;
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
    player.clearGameboard();

    resetBoardUi(player.id, player.getBoard().grid)
    resetFleetUi(player.id)
    disableConfirmBtn()
    gameState.activeShip = null;
}

export function attemptShipPlacement (row, col) {
    const player = gameState.players[gameState.currentPlayer];
    const shipReference = getActiveShipFromPlayerFleet(player);
    //console.log(shipReference)
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

//Used for the placeRandomFleet BTN
export function placeFleetRandomlyForCurrentPlayer () {
    resetPlayerBoard()
    const playerFleet = gameState.players[gameState.currentPlayer].getBoard().fleet;
    const activePlayer = gameState.players[gameState.currentPlayer]

    for(const boat of playerFleet){
        let placed = false;

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
    if(isPlacementCompleted(activePlayer)) enableConfirmBtn();
};

//Used as a random fleet placement for the CPU
export function placeRandomFleet () {
    const activePlayer = gameState.players[gameState.currentPlayer]
    const playerFleet = activePlayer.getBoard().fleet;
    

    for(const boat of playerFleet){
        let placed = false;
        

        while(placed === false){
            const direction = getRandomDirection()
            const rowCoord = getRandomCoord();
            const colCoord = getRandomCoord();

            gameState.activeShip = boat.id;
            gameState.shipDirection = direction;

            try {
                const placedCoords = activePlayer.getBoard().placeShip(boat, gameState.shipDirection, [rowCoord, colCoord]);
                //markCellsOccupied( activePlayer.id , placedCoords)
                if(placedCoords){
                    //markShipAsPlaced(gameState.activeShip);
                    gameState.activeShip = null;
                }
                placed = true;
            }catch (err) { 
                // invalid placement, try again
            }
        }
    }
}

export function isPlacementCompleted (player) {
    const fleetToCheck = player.getBoard().fleet;
    
    for(const boat of fleetToCheck){
        if(boat.isPlaced === false) return false;
    }

    return true

}