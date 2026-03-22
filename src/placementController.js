import { buildShip, createShipPlacementUi, renderPlacementScreen, renderGameboard, updateGameMessage, enableConfirmBtn, disableConfirmBtn, highlightPlacement, resetHighlightPlacement, clearPlacementComponents, updateDirectionButtons, toggleActiveClassOnShips, resetBoardUi, resetFleetUi, markCellsOccupied, markShipAsPlaced } from "./ui/index.js";
import { attachActiveShipEventListener, attachBoardEventListener,  attachPlacementBtnsEventListener, attachDragOverEvent, attachDropEvent, attachDragLeaveEvent, attachDragStartListener, attachClickListener, } from "./events.js";
import { createPlayers,} from "./playerSetup.js";
import { gameState, getBoards, getCurrentPlayer, } from "./gameState.js";
import { recordAndGetHistory } from "./messenger.js";
import { getRandomCoord, getRandomDirection } from "./utils.js";
import { triggerPhase } from "./gameController.js";

export function enterPlacementPhase () {
    createPlayers(gameState.settings);
    document.body.append(renderPlacementScreen());
    initializePlacementUI()
    const confirmBtn = document.getElementById("confirmPlacementBtn");
    attachClickListener(confirmBtn, handlePlacementConfirmation)
}

 function fireActionBasedOnBtnTarget (targetBtnId) {
    if(gameState.gamePhase !== "placement") return;

    switch(targetBtnId) {
        case "horizBtn": 
            if (gameState.shipDirection !== 'horizontal') {
                changeShipDirection();
                updateDirectionButtons('horizontal');
                updateGameMessage(recordAndGetHistory('info', 'Rotation: Horizontal.'));
            }
            break;
        case "vertBtn": 
            if (gameState.shipDirection !== 'vertical') {
                changeShipDirection();
                updateDirectionButtons('vertical');
                updateGameMessage(recordAndGetHistory('info', 'Rotation: Vertical.'));
            }
            break;        
        case "randomPlacementBtn": 
            randomizeHumanFleet(); 
            updateGameMessage(recordAndGetHistory('info', 'Fleet deployed randomly!'));
            break;
        case "resetBtn": 
            resetPlayerBoard(); 
            updateGameMessage(recordAndGetHistory('info', 'Board cleared. Ready for new orders.'));
            break;
        
    }
}

function selectShip (shipId) {
    const previousShip = gameState.activeShip && gameState.activeShip !== shipId ? gameState.activeShip : null;
    
    const shipEl = document.getElementById(shipId);
    if(!shipEl || !shipEl.classList.contains('ship')) return;
    toggleActiveClassOnShips(shipId, previousShip);
    gameState.activeShip = shipId;
    const selectionMsg = `${shipId} selected. Awaiting deployment coordinates.`;
    updateGameMessage(recordAndGetHistory('info', selectionMsg));
}

function handleDragStart (elementId) {
    selectShip(elementId);
}

function handleDragLeave () {
    const player = getCurrentPlayer();
    resetHighlightPlacement(player.id)
}

function getActiveShipFromPlayerFleet (player) {
    const shipId = gameState.activeShip;
    if(!shipId) return null;

    return player.getBoard().fleet.find(ship => ship.id === shipId);
}

function changeShipDirection() {
    if(gameState.shipDirection === 'horizontal'){
        gameState.shipDirection = 'vertical';
    }else if (gameState.shipDirection === 'vertical'){
        gameState.shipDirection = "horizontal";
    }
}

function resetPlayerBoard() {
    const player = getCurrentPlayer();
    player.getBoard().reset();

    resetBoardUi(player.id, player.getBoard().grid)
    resetFleetUi(player.id)
    disableConfirmBtn()
    gameState.activeShip = null;
    gameState.shipDirection = "horizontal"
}

function attemptShipPlacement (row, col) {
    const player = getCurrentPlayer();
    const shipReference = getActiveShipFromPlayerFleet(player);

    if (!shipReference) {
        const errorMsg = "TACTICAL ERROR: SELECT A SHIP FROM THE FLEET MANIFEST FIRST.";
        updateGameMessage(recordAndGetHistory('info', errorMsg));
        return; 
    }
    
    try{    
        const placedCoords = player.getBoard().placeShip(shipReference, gameState.shipDirection, [row, col]);
        markCellsOccupied( player.id , placedCoords);
        const successMsg = `${shipReference.id.toUpperCase()} DEPLOYED AT [${row},${col}].`;
        updateGameMessage(recordAndGetHistory('info', successMsg));
        if(placedCoords){
            markShipAsPlaced(gameState.activeShip);
            gameState.activeShip = null;
        }
    }catch (error){
        updateGameMessage(recordAndGetHistory('info', `PLACEMENT FAILED: ${error.message}`));
    }
}

function handleBoardClick(targetEl) {
    const row = parseInt(targetEl.dataset.row);
    const col = parseInt(targetEl.dataset.col);
    attemptShipPlacement(row, col);
    if(isPlacementCompleted(getCurrentPlayer())){
        enableConfirmBtn()
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

function randomizeHumanFleet () {
    resetPlayerBoard()
    const player = getCurrentPlayer()
    executeRandomPlacement(player, true)
    gameState.activeShip = null;
    if(isPlacementCompleted(player)) enableConfirmBtn();
};

function randomizeComputerFleet () {
    const player = getCurrentPlayer()
    executeRandomPlacement(player);
    gameState.activeShip = null;
}

function isPlacementCompleted (player) {
    const fleetToCheck = player.getBoard().fleet;
    
    for(const boat of fleetToCheck){
        if(boat.isPlaced === false) return false;
    }

    return true
}

function handlePlacementHover (row, col) {
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

function handlePlacementDrop (row, col){
    const player = getCurrentPlayer();
    resetHighlightPlacement(player.id);
    attemptShipPlacement(row, col);
    if(isPlacementCompleted(player)) enableConfirmBtn();
}

function handlePlacementConfirmation() {
    if(gameState.settings.mode === "pvp"){
        if(gameState.currentPlayer === 0){
            gameState.currentPlayer = 1;
            gameState.shipDirection = 'horizontal' 
            clearPlacementComponents()
            initializePlacementUI()
            const newConfirmBtn = document.getElementById("confirmPlacementBtn");
            attachClickListener(newConfirmBtn, handlePlacementConfirmation);
            disableConfirmBtn()
        } else {
            triggerPhase("game");
        }
    }else {
        gameState.currentPlayer = 1;
        randomizeComputerFleet();
        triggerPhase("game")
    }
}

function initializePlacementUI () {
    const fleetContainer = document.getElementById("fleetPlacementControls");
    fleetContainer.append(createShipPlacementUi(getCurrentPlayer().id));
    const fleetContainerSelector = document.querySelector(`.shipContainer[data-player-id = '${getCurrentPlayer().id}']`);
    buildShip(getCurrentPlayer().getBoard().shipDetailsForCreation, fleetContainerSelector);
    loadPlacementContainer();

    const welcomeMsg = `Welcome, Admiral ${getCurrentPlayer().id}. Deploy your fleet to the grid.`;
    const history = recordAndGetHistory('info', welcomeMsg);
    updateGameMessage(history);


    const nameDisplay = document.querySelector(".playerDisplayName");
    if(nameDisplay) nameDisplay.innerText = getCurrentPlayer().id
}


function loadPlacementContainer () {
    const interactiveBoard = document.getElementById("placementArea");
    const playerBoards = getBoards();
    interactiveBoard.append(renderGameboard(playerBoards[gameState.currentPlayer]));
    const shipContainer = document.querySelector(".shipContainer");
    attachActiveShipEventListener(shipContainer, handleDragStart)
    attachDragStartListener(shipContainer, selectShip);
    const playerBoard = document.querySelector(`.gridField[data-player-id = '${getCurrentPlayer().id}']`);
    attachBoardEventListener(playerBoard, handleBoardClick);
    attachDragOverEvent(playerBoard, handlePlacementHover);
    attachDragLeaveEvent(playerBoard, handleDragLeave)
    attachDropEvent(playerBoard, handlePlacementDrop);
    const btnsContainer = document.querySelector(`.btnContainer[data-player-id = '${getCurrentPlayer().id}']`);
    attachPlacementBtnsEventListener(btnsContainer, fireActionBasedOnBtnTarget);
}