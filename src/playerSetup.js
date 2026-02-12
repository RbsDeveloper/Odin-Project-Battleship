import { Player } from "./Player.js";
import { gameState } from "./gameState.js";
import { createSecondPlayerInput, removeSecondPlayerInput } from "./ui.js";

export function createPlayers (settings) {
    const firstPlayer = new Player("human", settings.firstPlayerName);
    let secondPlayer;

    if(settings.mode === "pvp"){
        secondPlayer = new Player("human", settings.secondPlayerName);
    }else{
        secondPlayer = new Player("computer", "computer");
    }
    
    gameState.players = [firstPlayer, secondPlayer];
}

export function toggleSecondPlayerInput () {

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