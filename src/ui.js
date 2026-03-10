import { gameState } from "./gameState.js";
import { createCompleteElement } from "./utils.js";

//FUNCTION THAT CREATES THE START GAME DIALOG
export function startDialog () {
    const dialogEl = createCompleteElement("dialog", ["startingDialog"], "", {id: "startingWindow"});
    // logo
    const logoContainer = createCompleteElement("div", ["logoWrapper"]);
    const logo = createCompleteElement("i", ["fa-solid", "fa-anchor", "gameLogo"],)
    logoContainer.append(logo)
    const gameTitle = createCompleteElement("h1", ["gameTitle"], "Battleship");

    const subtitle = createCompleteElement("h4", ["subtitle"], "strategic naval combat")

    const startGameBtn = createCompleteElement('button', ["btn", "startGameBtn"], "start battle", {id: "sgBtn"});
    
    dialogEl.append(logoContainer, gameTitle, subtitle, startGameBtn);

    return dialogEl
}

// new gameMode form architechture

export function createLobby () {
    const subtitle = createCompleteElement("h4", ["subtitle"], "naval command system");
    const title = createCompleteElement("h2", ["lobbyTitle"], "Mission briefing");

    const formEl = createCompleteElement("form", ["settingsForm"], "", {id: "btnFieldset"});
    const gameModeSection = createCompleteElement("section", ["modeSection"]);
    const gameModeLabel = createCompleteElement("p", ["sectionLabel"], "01 - Select Game Mode");
    const modeOptionsWrapper = createCompleteElement("div", ["modeOptions"]);

    const pvcBtn = createModeBtn(
        '<i class="fa-solid fa-desktop"></i>', 
        "solo", 
        "vs Computer", 
        "Challenge the AI opponent", 
        "pvc"
    );

    const pvpBtn = createModeBtn(
        '<i class="fa-solid fa-user-group"></i>', 
        "local", 
        "vs Player", 
        "Pass & play on a device", 
        "pvp"
    );
    
    modeOptionsWrapper.append(pvcBtn, pvpBtn);

    const hiddenInput = createCompleteElement("input", [], "", {type: "hidden", id: "modeInput", name: "mode", value: "pvc"});
    gameModeSection.append(gameModeLabel, modeOptionsWrapper, hiddenInput);

    const playersInfoSection = createCompleteElement("section", ["playersSection"]);
    const playerInfoLabel = createCompleteElement("p", ["sectionLabel"], "02 - Commander");

    const firstPlayerGroup = createCompleteElement("div", ["inputGroup"]);
    const firstPlayerLabel = createCompleteElement("label", [], "", {for:"firstPlayerInput"});
    const firstPlayerNameInput = createCompleteElement("input", [], "", {type: "text", name: "firstPlayerName", id:"firstPlayerInput", placeholder:"Your callsign", required: true, autocomplete: "off"});

    firstPlayerGroup.append(firstPlayerLabel, firstPlayerNameInput);
    playersInfoSection.append(playerInfoLabel, firstPlayerGroup);

    const submitBtn = createCompleteElement("button", ["btn", "formSubmitBtn"], "Deploy fleet", {type: "submit", disabled: true});

    formEl.append(gameModeSection, playersInfoSection, submitBtn);

    return [subtitle, title, formEl];
}

export function createSecondPlayerGroup () {
    const secondPlayerGroup = createCompleteElement("div", ["inputGroup"]);
    const secondPlayerLabel = createCompleteElement("label", [], "", {for:"secondPlayerInput"});
    const secondPlayerNameInput = createCompleteElement("input", [], "", {type: "text", name: "secondPlayerName", id:"secondPlayerInput", placeholder:"Player 2 name", required: true, autocomplete: "off"});
    secondPlayerGroup.append(secondPlayerLabel, secondPlayerNameInput);
    
    return secondPlayerGroup
}

function createModeBtn(iconHtml, tag, title, desc, modeValue) {
    const btn = createCompleteElement("button", ["modeCardBtn"], "", { 
        type: "button", 
        "data-mode": modeValue 
    });

    if(modeValue === "pvc"){
        btn.classList.add("activeMode")
    }

    const btnIcon = createCompleteElement("div", ["modeIcon"],);
    btnIcon.innerHTML = iconHtml;
    const modeTag = createCompleteElement("span", ["modeTag"], tag);
    const modeTitle = createCompleteElement("span", ["modeTitle"], title);
    const modeDescription = createCompleteElement("span", ["modeDescription"], desc);

    btn.append(btnIcon, modeTag, modeTitle, modeDescription);
    return btn;
}

export function removeSecondPlayerGroup () {
    const input = document.getElementById("secondPlayerInput")
    if(input) input.closest(".inputGroup").remove()
}

//FUNCTION THAT CREATES THE GAME SCREEN OR ARENA
export function renderGameScreen (players) {
    const mainContainer = createCompleteElement("main", [], "",);
    const messageContainer = createCompleteElement("div", ["msgContainer"], "", {id: "msgWrapper"});
    const interactiveArea = createCompleteElement("div", ["interactiveContainer"], "", {id: "interactiveZone"})

    const leftFleetContainer = createCompleteElement("div", ["fleetContainer"], "", {id: "leftFleet", "data-player-id": `${players[0].id}`});
    const middleContainer = createCompleteElement("div", ["gameboardsContainer"], "", {id: "boardsArea"})
    const rightFleetContainer = createCompleteElement("div", ["fleetContainer"],"", {id: "rightFleet", "data-player-id": `${players[1].id}`});
    
    interactiveArea.append(leftFleetContainer, middleContainer, rightFleetContainer);
    mainContainer.append(messageContainer, interactiveArea);
    return mainContainer
}

//creates the boards for both players inside the boardArea, best for the game phase
export function createPlayerBoardsArea  (boardsData) {
    const boardsDestination = document.getElementById("boardsArea");
    
    boardsData.forEach(playerGrid => {
        boardsDestination.append(renderGameboard(playerGrid));
    });
}

//creates placement scree

export function renderPlacementScreen () {
    const mainContainer = createCompleteElement("main", [], "",);
    const messageContainer = createCompleteElement("div", ["msgContainer"], "", {id: "msgWrapper"});
    const interactiveArea = createCompleteElement("div", ["interactiveContainer"], "", {id: "interactiveZone"})

    const fleetPlacementContainer = createCompleteElement("div", ["fleetContainer"], "", {id: "fleetPlacementControls"});
    const gridContainer = createCompleteElement("div", ["placementBoardContainer"], "", {id: "placementArea"})
    interactiveArea.append(fleetPlacementContainer, gridContainer);
    mainContainer.append(messageContainer, interactiveArea);

    return mainContainer;
}

export function buildShip (shipDetails, destination) {

    shipDetails.forEach(item => {
        const build = createCompleteElement("div", ["ship"], "", {id: `${item.id}`, draggable: true});
        build.innerHTML = `<span class="dot"></span> <span class="shipName">${item.id}</span>`
        const sizeWrapper = createCompleteElement("div", ["sizeWrapper"]);
        const sizeBar = createCompleteElement("div", ["sizeBar"]);
        const multiplier = createCompleteElement("span", ["multiplier"], `x${item.length}`);
        sizeWrapper.append(sizeBar, multiplier);
        for(let i=0; i<item.length; i++){
            sizeBar.appendChild(createCompleteElement("div", ["sizeBlock"]))
        }
        build.append(sizeWrapper)
        destination.append(build);
    })   
}
//creates the container where the ships and btn controlls are stored for placement
export function createShipPlacementUi  (identityParam) {
    const placementContainer = createCompleteElement("div", ["placementContainer"]);
    const fleetSelector = createCompleteElement("div", ["shipContainer"], "", {"data-player-id": `${identityParam}`});
    const separator = createCompleteElement("hr", ["separator"]);
    const placementControls = createCompleteElement("div", ["btnContainer"], "", {"data-player-id": `${identityParam}`});

    //SECTION 02: ORIENTATION

    const section02 = createCompleteElement("div", ["uiSection"]);
    const orientationLabel = createCompleteElement("p", ["sectionLabel"], "02 - Orientation");
    const orientationBtnsGroup = createCompleteElement("div", ["controlGroup"]);

    const horizontalBtn = createCompleteElement("button", ["controlBtn"], "Horiz", {id:"horizBtn"})
    horizontalBtn.prepend(createCompleteElement("i", ["fa-solid", "fa-arrow-right"]));
    const verticalBtn = createCompleteElement("button", ["controlBtn"], "Vert", {id:"vertBtn"})
    verticalBtn.prepend(createCompleteElement("i", ["fa-solid", "fa-arrow-down"]));
    if(gameState.shipDirection==='horizontal'){
        horizontalBtn.classList.add("active");
    }else if (gameState.shipDirection==="vertical"){
        verticalBtn.classList.add("active");
    }

    orientationBtnsGroup.append(horizontalBtn, verticalBtn);
    section02.append(orientationLabel, orientationBtnsGroup);

    //SECTION 03: ACTIONS 

    const section03 = createCompleteElement("div", ["uiSection"]);
    const actionsLabel = createCompleteElement("div", ["sectionLabel"], "03 - Actions");
    const actionsBtnsGroup = createCompleteElement("div", ["controlGroup"]);

    const randomBtn = createCompleteElement("button", ["actionBtn"], "Random", {id: "randomPlacementBtn"});
    randomBtn.prepend(createCompleteElement("i", ["fa-solid", "fa-shuffle"]))
    const resetBtn = createCompleteElement("button", ["actionBtn"], "Clear", {id: "resetBtn"});
    resetBtn.prepend(createCompleteElement("i", ["fa-solid", "fa-trash-can"]))

    actionsBtnsGroup.append(randomBtn, resetBtn);
    section03.append(actionsLabel, actionsBtnsGroup);

    //LAUNCH GAME WRAPPER

    const launchWrapper = createCompleteElement("div", ["launchWrapper"]);
    const launchBtn = createCompleteElement("button", ["btn", "confirmBtn"], "Launch Battle", {id: "confirmPlacementBtn", disabled: true});
    launchWrapper.append(launchBtn);
    placementControls.append(section02, section03, launchWrapper);
    placementContainer.append(fleetSelector, separator, placementControls);

    return placementContainer
}

export function updateDirectionButtons(activeDirection) {
    const horizBtn = document.getElementById('horizBtn');
    const vertBtn = document.getElementById('vertBtn');

    if (activeDirection === 'horizontal') {
        horizBtn.classList.add('active');
        vertBtn.classList.remove('active');
    } else {
        vertBtn.classList.add('active');
        horizBtn.classList.remove('active');
    }
}

export function renderGameboard (grid) {

    const boardContainer = createCompleteElement('div', ['board'], '', {'data-player-id': grid.id})

    createCells(boardContainer, grid.grid);

    return boardContainer;
}

function createCells (container, board) {
    for(let i = 0 ; i < board.length; i++){

        for(let j = 0; j < board[i].length ; j++){

            const cell = createCompleteElement('div', ['cell'], '', {"data-row": `${i}`, "data-col": `${j}`})

            container.append(cell);

        }

    }
}

export function toggleActiveClassOnShips(newActive, oldShip = null) {
    if (oldShip) {
        document.getElementById(oldShip).classList.remove("active");
    }
    document.getElementById(newActive).classList.add("active");
}

export function markCellsOccupied (playerId, coords) {
    coords.forEach(([r , c]) => {
        const cell = document.querySelector(`.board[data-player-id = '${playerId}'] .cell[data-row='${r}'][data-col='${c}']`)
        cell.classList.add("ship-placed");
    })
}

export function markShipAsPlaced (shipId) {
    const shipEl = document.getElementById(shipId);
    if(shipEl){
        shipEl.classList.add("placed");
        shipEl.classList.remove("active");
    }
}

export function resetBoardUi (playerId, boardsDetails) {
    const targetBoard = document.querySelector(`.board[data-player-id = '${playerId}']`);
    targetBoard.innerHTML = "";
    createCells(targetBoard, boardsDetails);
}

export function resetFleetUi (playerId) {
    const shipsContainer = document.querySelector(`.shipContainer[data-player-id = '${playerId}']`)
    if(!shipsContainer) return;

    [...shipsContainer.children].forEach(ship => {
         ship.classList.remove("active", "placed");
    }); 
}

export function enableConfirmBtn () {
    const confirmBtn = document.getElementById("confirmPlacementBtn");
    confirmBtn.disabled = false;
    confirmBtn.classList.add("confirmReady")
}

export function disableConfirmBtn () {
    const confirmBtn = document.getElementById("confirmPlacementBtn");
    if(!confirmBtn.disabled) confirmBtn.disabled = true;
    if(confirmBtn.classList.contains("confirmReady")) confirmBtn.classList.remove("confirmReady")
}
  
export function clearPlacementComponents () {
    const fleetContainer = document.getElementById("fleetPlacementControls");
    fleetContainer.innerHTML = "";
    const interactiveBoards = document.getElementById("placementArea");
    interactiveBoards.innerHTML = ""

}

export function markCellAsHit (attackResult, cell) {

    if(attackResult === "hit" || attackResult === "sunk") {
        cell.classList.add("hit");
    }else if(attackResult === 'miss'){
        cell.classList.add("miss");
    }
}

export function renderWinnerDialog (winnerPlayer) {
    const winnerDialog = createCompleteElement("dialog", ["winnerDialog"], `The winner is: ${winnerPlayer}`, {id: "winnerDialog"});
    const winnerParagraph = createCompleteElement("p", ["winnerMessage"], "", {id:"winnerMessage"});
    const actions = createCompleteElement("div", ["restartBtnsContainer"], "");
    const samePlayersRestart = createCompleteElement("button", ["btn", "samePlayersRestart"], "Play Again(same players)", {id: "restartSamePlayers"});
    const newGame = createCompleteElement("button", ["btn", "newGameBtn"], "Start New Game", {id:"startNewGame"});

    actions.append(newGame, samePlayersRestart);
    winnerDialog.append(winnerParagraph, actions);

    return winnerDialog;
}

export function clearWindow () {
    document.body.innerHTML = "";
}

export function highlightPlacement (playerId, coords, isValid) {
    const className = isValid ? "preview-valid" : "preview-invalid";
    coords.forEach(([r,c]) => {
        const cell = document.querySelector(`.board[data-player-id ='${playerId}'] .cell[data-row='${r}'][data-col='${c}']`);
        if(cell){
            cell.classList.add(className);
        }
    }) 
}

export function resetHighlightPlacement (playerId) {
    let highlightedCells = document.querySelectorAll(
        `.board[data-player-id='${playerId}'] .cell.preview-valid,
         .board[data-player-id='${playerId}'] .cell.preview-invalid`
        );
     
        highlightedCells.forEach(cell => {
        cell.classList.remove("preview-valid", "preview-invalid");
        }) 
}

export function updateGameMessage (message){
    const msgContainer = document.getElementById("msgWrapper");
    if (!msgContainer) return;
    msgContainer.innerText = "";
    const messageElement = createCompleteElement("p", ["gameMsg"], `${message}`, {id: "msgText"});
    msgContainer.append(messageElement);
}

export function renderFleetStatus (owner, destination ) {
    //const wrapper = createCompleteElement("div", ["fleetStatusWrapper"])
    const title = createCompleteElement("h3", ["fleetTitle"], `${owner.id}'s Fleet`,);
    const shipConstructionPlans = owner.getBoard().shipDetailsForCreation;
    console.log(shipConstructionPlans)
    destination.append(title)

    shipConstructionPlans.forEach(ship => {
            destination.append(createShipCard(ship))
    })
    
}

function createShipCard (shipReference) {
    const card = createCompleteElement("div", ["shipCard"], "", {"data-ship-id": `${shipReference.id}`});
    const header = createCompleteElement("div", ["cardHeader"]);
    const shipName = createCompleteElement("h4", ["shipName"], `${shipReference.id}`);
    const hpPoints = createCompleteElement("span", ["hpPoints"], `${shipReference.length}`);
    const shipContainer = createCompleteElement("div", ["shipHp"]);
    createHitPoints(shipReference.length, shipContainer);

    header.append(shipName, hpPoints);
    card.append(header, shipContainer);

    return card;
}

function createHitPoints(length, destination){
    for(let i = 0; i< length; i++){
        destination.append(createCompleteElement("div", ["hpPoint"]))
    }
}

export function updateShipCard (hpNum, healthPointsDivs) {
    const currentHp = parseInt(hpNum.textContent) - 1;
    hpNum.textContent = currentHp;
    healthPointsDivs[parseInt(hpNum.textContent)].classList.add("hit")
    if(currentHp === 0){
        hpNum.closest(".shipCard").classList.add("sunk")
    }
}

export function showHumanShips () {
    const player =gameState.players[0]
    const humanGrid = player.getBoard().grid;
    const boardEl = document.querySelector(`.board[data-player-id="${player.id}"]`)

    if(!boardEl)return 

    humanGrid.forEach((row, i) => {
        row.forEach((cell, j) => {
            if(cell.hasShip){
                const cellEl = document.querySelector(`.cell[data-row="${i}"][data-col="${j}"]`);
                if(cellEl) cellEl.classList.add("ship-placed")
            }
        })
    })
}