import { Player } from "./Player.js";
import { gameState } from "./gameState.js";

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
