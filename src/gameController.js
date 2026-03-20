import { gameState } from "./gameState.js";
import { enterStartPhase, handleStartClick } from "./sessionController.js";
import { enterSettingsPhase } from "./sessionController.js";
import { enterPlacementPhase } from "./placementController.js";
import { enterGamePhase } from "./combatPhase.js";
import { enterWinnerPhase } from "./combatPhase.js";
import { attachClickListener,  } from "./events.js";


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
    attachClickListener(startBtn, handleStartClick);
}

// function handleStartClick (event){
//     const button = event.target;
//     button.remove();
//     triggerPhase("settings")
// }

// function enterStartPhase () {
//     document.body.append(startDialog())
//     const modal = document.getElementById("startingWindow");
//     modal.show()
// }

// function handleSubmitClick (e) {
//     e.preventDefault();
//     const formElement = e.target
//     const formData = new FormData(formElement);
//     const modal = document.getElementById("startingWindow")
//     modal.close();
//     modal.remove();
//     gameState.settings = Object.fromEntries(formData);
//     triggerPhase("placement");
// }

// function manageLobbyInternals (e) {
//     const btnEl = e.target.closest("button");
//         const hiddenInput = document.getElementById("modeInput");

//         if(!btnEl) return;

//         const btnsCollection = document.querySelectorAll(".modeCardBtn");
//         btnsCollection.forEach(b => b.classList.remove("activeMode"))

//         btnEl.classList.add("activeMode");
//         hiddenInput.value = btnEl.dataset.mode;

//         if (hiddenInput.value === "pvp"){
//             if(!document.getElementById("secondPlayerInput")) {

//                 const playersSection = document.querySelector(".playersSection")
//                 playersSection.append(createSecondPlayerGroup())
//             }
//         }else{
//             removeSecondPlayerGroup()
//         }
// }

// function handleFormValidation (e) {
//     const form = e.currentTarget;
//     const submitBtn = document.querySelector(".formSubmitBtn");

//     if(form.checkValidity()){
//         submitBtn.disabled = false;
//         submitBtn.classList.add("submitReady");
//     }else{
//         submitBtn.disabled = true;
//         submitBtn.classList.remove("submitReady")
//     }
// }

// function handleLobbyGameModeSwitch () {
//     const btnWrapper = document.querySelector(".modeOptions");
//     setUpModeToggle(btnWrapper, manageLobbyInternals)
// }

// function enterSettingsPhase () {
//     const modal = document.getElementById("startingWindow");
//     modal.innerHTML = "";
//     const lobby = createLobby();
//     lobby.forEach(el => modal.append(el))
//     handleLobbyGameModeSwitch()
//     const form = modal.querySelector("form");
//     attachValidationListener(form, handleFormValidation);
//     attachFormEventListener(form, handleSubmitClick);
// }

// function handlePlacementConfirmation() {
//     if(gameState.settings.mode === "pvp"){
//         if(gameState.currentPlayer === 0){
//             gameState.currentPlayer = 1;
//             gameState.shipDirection = 'horizontal' 
//             clearPlacementComponents()
//             initializePlacementUI()
//             const newConfirmBtn = document.getElementById("confirmPlacementBtn");
//             attachClickListener(newConfirmBtn, handlePlacementConfirmation);
//             disableConfirmBtn()
//         } else {
//             triggerPhase("game");
//         }
//     }else {
//         gameState.currentPlayer = 1;
//         randomizeComputerFleet();
//         triggerPhase("game")
//     }
// }

// function enterPlacementPhase () {
//     createPlayers(gameState.settings);
//     document.body.append(renderPlacementScreen());
//     initializePlacementUI()
//     const confirmBtn = document.getElementById("confirmPlacementBtn");
//     attachClickListener(confirmBtn, handlePlacementConfirmation)
// }

// function enterGamePhase () {
//     console.log("Inside game phase")
//     document.body.innerHTML = "";
//     document.body.append(renderGameScreen(gameState.players));
//     createPlayerBoardsArea(getBoards(), gameState.players);
//     mountFleetStatusUi(gameState.players);

//     gameState.currentPlayer = 0;

//     const startMsg = `Battle commenced! ${getCurrentPlayer().id}, take the first shot.`;
//     const history = recordAndGetHistory('info', startMsg);
//     updateGameMessage(history);
//     updateGameStatsHeader(gameState.players[gameState.currentPlayer]);

//     if(gameState.settings.mode === 'pvc'){
//         singlePlayerMatch();

//         const player = gameState.players[0]
//         const humanGrid = player.getBoard().grid;
//         const boardEl = document.querySelector(`.gridField[data-player-id="${player.id}"]`)
//         if(!boardEl)return
//         showHumanShips(humanGrid, boardEl)
//     }else{
//         pvpMatch()
//     }
// }

// export function handleBoardClick(targetEl) {
//     const row = parseInt(targetEl.dataset.row);
//     const col = parseInt(targetEl.dataset.col);
//     if(gameState.gamePhase === "placement"){
//         attemptShipPlacement(row, col);
//         if(isPlacementCompleted(getCurrentPlayer())){
//             enableConfirmBtn()
//         }
//     }else if(gameState.gamePhase === "game"){
//         processAttack(targetEl)
//     }
// }

// export function initializePlacementUI () {
//     const fleetContainer = document.getElementById("fleetPlacementControls");
//     fleetContainer.append(createShipPlacementUi(getCurrentPlayer().id));
//     const fleetContainerSelector = document.querySelector(`.shipContainer[data-player-id = '${getCurrentPlayer().id}']`);
//     buildShip(getCurrentPlayer().getBoard().shipDetailsForCreation, fleetContainerSelector);
//     loadPlacementContainer();

//     const welcomeMsg = `Welcome, Admiral ${getCurrentPlayer().id}. Deploy your fleet to the grid.`;
//     const history = recordAndGetHistory('info', welcomeMsg);
//     updateGameMessage(history);


//     const nameDisplay = document.querySelector(".playerDisplayName");
//     if(nameDisplay) nameDisplay.innerText = getCurrentPlayer().id
// }

// export function fireActionBasedOnBtnTarget (targetBtnId) {
//     if(gameState.gamePhase !== "placement") return;

//     switch(targetBtnId) {
//         case "horizBtn": 
//             if (gameState.shipDirection !== 'horizontal') {
//                 changeShipDirection();
//                 updateDirectionButtons('horizontal');
//                 updateGameMessage(recordAndGetHistory('info', 'Rotation: Horizontal.'));
//             }
//             break;
//         case "vertBtn": 
//             if (gameState.shipDirection !== 'vertical') {
//                 changeShipDirection();
//                 updateDirectionButtons('vertical');
//                 updateGameMessage(recordAndGetHistory('info', 'Rotation: Vertical.'));
//             }
//             break;        
//         case "randomPlacementBtn": 
//             randomizeHumanFleet(); 
//             updateGameMessage(recordAndGetHistory('info', 'Fleet deployed randomly!'));
//             break;
//         case "resetBtn": 
//             resetPlayerBoard(); 
//             updateGameMessage(recordAndGetHistory('info', 'Board cleared. Ready for new orders.'));
//             break;
        
//     }
// }

// function handleDragStart (elementId) {
//     selectShip(elementId);
// }

// function handleDragLeave () {
//     const player = getCurrentPlayer();
//     resetHighlightPlacement(player.id)
// }

// function loadPlacementContainer () {
//     const interactiveBoard = document.getElementById("placementArea");
//     const playerBoards = getBoards();
//     interactiveBoard.append(renderGameboard(playerBoards[gameState.currentPlayer]));
//     const shipContainer = document.querySelector(".shipContainer");
//     attachActiveShipEventListener(shipContainer, handleDragStart)
//     attachDragStartListener(shipContainer, selectShip);
//     const playerBoard = document.querySelector(`.gridField[data-player-id = '${getCurrentPlayer().id}']`);
//     attachBoardEventListener(playerBoard, handleBoardClick);
//     attachDragOverEvent(playerBoard, handlePlacementHover);
//     attachDragLeaveEvent(playerBoard, handleDragLeave)
//     attachDropEvent(playerBoard, handlePlacementDrop);
//     const btnsContainer = document.querySelector(`.btnContainer[data-player-id = '${getCurrentPlayer().id}']`);
//     attachPlacementBtnsEventListener(btnsContainer, fireActionBasedOnBtnTarget);
// }

// function singlePlayerMatch () {
//     const opponentPlayer = gameState.players[opponentIndex(gameState.currentPlayer)];
//     const computerBoard = document.querySelector(`.gridField[data-player-id = "${opponentPlayer.id}"]`);
//     attachBoardEventListener(computerBoard, handleBoardClick);
// }

// function pvpMatch () {
//     const boardsContainer = document.getElementById("boardsArea");
//     attachBoardEventListener(boardsContainer, handleBoardClick);
// }

// async function computerAttack () {
//     const opponentPlayer = gameState.players[opponentIndex(gameState.currentPlayer)];
//     const humanBoard = document.querySelector(`.gridField[data-player-id = "${opponentPlayer.id}"]`)
//     const computerAttackCoords = getCurrentPlayer().getNextMove();

//     await delayActions(1000)

//         const resultOfTheAttack = opponentPlayer.getBoard().receiveAttack([computerAttackCoords.row, computerAttackCoords.col]);
       
//         playSound('fire')   
//         const targetCell = humanBoard.querySelector(`.cell[data-row = "${computerAttackCoords.row}"][data-col = "${computerAttackCoords.col}"]`);
       
//         await delayActions(1000)
//         playSound(resultOfTheAttack)
//         markCellAsHit(resultOfTheAttack, targetCell);

//         if(resultOfTheAttack==='hit'){
//             gameState.players[gameState.currentPlayer].hits++
//             const msg = `BOOM! ${getCurrentPlayer().id} scored a hit on our fleet!`;
//             updateGameMessage(recordAndGetHistory('hit', msg));
//             getCurrentPlayer().addAdjacentCells(computerAttackCoords);
//             updateShipsHp(opponentPlayer, computerAttackCoords.row, computerAttackCoords.col)
//         }else if(resultOfTheAttack === 'miss'){
//             gameState.players[gameState.currentPlayer].misses++
//             const msg = `SPLASH! ${getCurrentPlayer().id} missed the target.`;
//             updateGameMessage(recordAndGetHistory('miss', msg));
//         }else if(resultOfTheAttack === 'sunk'){
//             gameState.players[gameState.currentPlayer].hits++
//             const msg = "CRITICAL DAMAGE! ONE OF OUR SHIPS HAS BEEN SUNK!";
//             updateGameMessage(recordAndGetHistory('sunk', msg));
//             getCurrentPlayer().clearTargetingQueue();
//             updateShipsHp(opponentPlayer, computerAttackCoords.row, computerAttackCoords.col)
//         }
//         updateGameStatsBody(gameState.players[gameState.currentPlayer], resultOfTheAttack)

//     await delayActions(500)
//     if(checkLoss(opponentPlayer)){
//         triggerPhase("winner");
//         gameState.isProcessingTurn = false
//         return
//     }
//     await delayActions(1000);
//     const turnMsg = `IT IS NOW ${opponentPlayer.id}'S TURN!`;
//     updateGameMessage(recordAndGetHistory('info', turnMsg));
    

//     gameState.currentPlayer = opponentIndex(gameState.currentPlayer);
//     updateGameStatsHeader(gameState.players[gameState.currentPlayer]) 
// }

// function checkLoss (playerToCheck) {
//     return playerToCheck.getBoard().areAllShipSunk();   
// }

// function handleNewGame () {
//     clearWindow();
//     resetGameState(true)
//     initGame()
// }

// function handlePlayAgain () {
//     clearWindow();
//     resetGameState();
//     triggerPhase("placement")
// }

// function enterWinnerPhase () {
//     const activePlayer = getCurrentPlayer();
//     document.body.append(renderWinnerDialog(activePlayer.id))
//     document.getElementById("winnerDialog").showModal();
//     const newGameBtn = document.getElementById("startNewGame");
//     const playAgainBtn =  document.getElementById("restartSamePlayers");

//     attachClickListener(newGameBtn, handleNewGame);
//     attachClickListener(playAgainBtn, handlePlayAgain);
// }

// function processAttack(targetEl) {
//     const playerBoard = targetEl.parentElement;
//     const activePlayer = getCurrentPlayer();
//     const opponentPlayer = gameState.players[opponentIndex(gameState.currentPlayer)];
//     const row = parseInt(targetEl.dataset.row);
//     const col = parseInt(targetEl.dataset.col);

//     if(gameState.isProcessingTurn)return;
//     gameState.isProcessingTurn = true;

    
//     if(playerBoard.dataset.playerId === activePlayer.id){
//         gameState.isProcessingTurn = false;
//         return
//     }
//     handleCombatFlow(targetEl,activePlayer, opponentPlayer, row, col )
    
// }

// async function handleCombatFlow(targetEl,currentPlayer , opponent, row, col) {

//     const resultOfTheAttack = opponent.getBoard().receiveAttack([row,col]);
//     if(resultOfTheAttack===null){
//         updateGameMessage(recordAndGetHistory('info', "Target coordinates already engaged."));
//         gameState.isProcessingTurn = false;
//         return
//     }

//     playSound('fire');
//     await delayActions(1000);
//     playSound(resultOfTheAttack);
//     markCellAsHit(resultOfTheAttack, targetEl);

//     if(resultOfTheAttack==='hit'){
//         currentPlayer.hits++
//         const msg = `BOOM! ${currentPlayer.id} scored a hit!`;
//         updateGameMessage(recordAndGetHistory('hit', msg));
//         updateShipsHp(opponent, row, col)
//     }else if(resultOfTheAttack === 'miss') {
//         currentPlayer.misses++
//         const msg = `SPLASH! ${currentPlayer.id} missed!`;
//         updateGameMessage(recordAndGetHistory('miss', msg));
//     }else if(resultOfTheAttack === "sunk"){
//         currentPlayer.hits++
//         const msg = `DIRECT HIT! ADMIRAL ${currentPlayer.id} HAS SUNK AN ENEMY VESSEL!`;
//         updateGameMessage(recordAndGetHistory('sunk', msg));
//         updateShipsHp(opponent, row, col)
//     }
//     updateGameStatsBody(currentPlayer, resultOfTheAttack)
    
//     await delayActions(500)
//     if(checkLoss(opponent)){
//         triggerPhase("winner");
//         gameState.isProcessingTurn = false
//         return
//     }

//     await delayActions(1000);
//     gameState.currentPlayer = opponentIndex(gameState.currentPlayer);
//     const turnMsg = `IT IS NOW ${getCurrentPlayer().id}'S TURN!`;
//     updateGameMessage(recordAndGetHistory('info', turnMsg));
//     updateGameStatsHeader(gameState.players[gameState.currentPlayer])
    
//     if(gameState.settings.mode === "pvc"){
//         await computerAttack()
//     }
//     gameState.isProcessingTurn = false
// }

// function mountFleetStatusUi(players) {
//     players.forEach(player => {
//         console.log(player)
//         const destination = document.querySelector(`.fleetContainer[data-player-id= "${player.id}"]`);
//         renderFleetStatus(player, destination)
//     })
// }

// function updateShipsHp (opponent, row, col) {
//     const shipToSearch = opponent.getBoard().grid[row][col].shipReference;
//     const card = document.querySelector(`.fleetContainer[data-player-id="${opponent.id}"] .shipCard[data-ship-id="${shipToSearch.id}"]`);
//     const hpPoints = card.querySelector(".hpPoints");
//     const lifePoints = card.querySelectorAll(".hpPoint");
//     updateShipCard(hpPoints, lifePoints);
// }