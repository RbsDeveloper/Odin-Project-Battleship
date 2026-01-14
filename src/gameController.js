import { Player } from "./Player.js";
import { buildShip, layoutFunctions, renderGameScreen } from "./ui.js";

let players;
let dataFromForm; 


export const initGame = () => {  

    enterStartPhase()

    const startBtn = document.getElementById("sgBtn");
    
    startBtn.addEventListener("click", () => {
        enterSettingsPhase()
    })
}

const enterStartPhase = () => {
    const startModal = layoutFunctions().startDialog();
    document.body.appendChild(startModal);
    startModal.show();
}

const enterSettingsPhase = () => {
    const startModal = document.getElementById("startingWindow");
    const startBtn = document.getElementById("sgBtn");
    const formElement = layoutFunctions().insertSettingsForm();
    startBtn.remove();
    startModal.append(formElement);
    toggleSecondPlayerInput()

    formElement.addEventListener('submit', (e)=> {
        e.preventDefault();
        const formData = new FormData(formElement);
        dataFromForm = Object.fromEntries(formData);
        
        startModal.close();
        startModal.remove();
        createPlayers(dataFromForm);
        enterPlacementPhase()
    })
}

const enterPlacementPhase = () => {
    renderPlacementUi()
}

export function getBoards () {

    const boards = players.map(player => ({
        id : player.id,
        type: player.type,
        grid: player.gameboard.grid.map(row => row.map(cell => ({...cell})))
    }))

    return boards;
}

//HELPER FUNCTIONS 
const createPlayers = (settings) => {
    const firstPlayer = new Player("human", settings.firstPlayerName);
    let secondPlayer;

    if(settings.mode === "pvp"){
        secondPlayer = new Player("human", settings.seconPlayerName);
    }else{
        secondPlayer = new Player("computer", "Computer");
    }

    players = [firstPlayer, secondPlayer];
}

function toggleSecondPlayerInput () {

    const fieldset = document.getElementById("btnFieldset");

    fieldset.addEventListener('change', (e) => {
        if(e.target.value === "pvp"){
            if(!document.getElementById("secondPlayerInput")){
                layoutFunctions().createSecondPlayerInput()
            }
        }else{
            layoutFunctions().removeSecondPlayerInput()
        }
    })
}

function renderPlacementUi () {
    //we create the player instances
    const boardsInfo = getBoards();
    //we append the general layout and the boards for both players
    document.body.append(layoutFunctions().renderGameScreen());
    layoutFunctions().createPlayerBoardsArea(boardsInfo);
    //we populate the fleetContainers now
    
    const leftFleet = document.getElementById("leftFleet");
    const rightFleet = document.getElementById("rightFleet");
    console.log(players[0].id)
    leftFleet.append(layoutFunctions().createShipPlacementUi(players[0].id));
    const leftFleetSelector = document.querySelector(`.shipContainer[data-player-id = '${players[0].id}']`);
    
    buildShip(players[0].gameboard.shipDetailsForCreation, leftFleetSelector);

    if(dataFromForm.mode === 'pvp'){
        rightFleet.append(layoutFunctions().createShipPlacementUi(players[1].id));
        const rightFleetSelector = document.querySelector(`.shipContainer[data-player-id = "${players[1].id}"]`);
        buildShip(players[1].gameboard.shipDetailsForCreation, rightFleetSelector); 
    }
}
