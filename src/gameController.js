import { Player } from "./Player.js";
import { layoutFunctions } from "./ui.js";

let players;

const startGameFlow = () => {
    const startModal = layoutFunctions().startDialog();
    document.body.appendChild(startModal);
    startModal.show();

    const startBtn = document.getElementById("sgBtn");

    startBtn.addEventListener("click", () => {
        startModal.close()
        startModal.remove();
        showGameSettings()
    })
}

const showGameSettings = () => {
    const settingsModal = layoutFunctions().gameSettingsDialog();
    document.body.appendChild(settingsModal);
    settingsModal.show();

    toggleSecondPlayerInput()

    const form = document.querySelector("#gameSettingsForm");
    
    form.addEventListener('submit', (e)=> {
        e.preventDefault();
        const formData = new FormData(form);
        const config = Object.fromEntries(formData);
        
        settingsModal.close();
        settingsModal.remove();
        
        setUpPlayer(config);
    })

    

}

export const initGame = () => {

    startGameFlow()

/*
    const firstPlayer = new Player('human', 'first');
    const secondPlayer = new Player('computer', 'second');

    players = [firstPlayer, secondPlayer];*/
}

export function getBoards () {

    const boards = players.map(player => ({
        id : player.id,
        type: player.type,
        grid: player.gameboard.grid.map(row => row.map(cell => ({...cell})))
    }))

    return boards;
}

export function extractShipDetails () {
    const details = players[0].gameboard.shipDetailsForCreation;

    return details;
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
 
const setUpPlayer = (settings) => {
    const firstPlayer = new Player("human", settings.firstPlayerName);
    let seconPlayer;

    if(settings.mode === "pvp"){
        seconPlayer = new Player("human", settings.seconPlayerName);
    }else{
        seconPlayer = new Player("computer", "Computer");
    }

    players = [firstPlayer, seconPlayer];
}