import { Player } from "./Player.js";
import { gameState } from "./gameState.js";

export function createPlayers (settings) {
    const firstPlayer = Player("human", settings.firstPlayerName);
    let secondPlayer;

    if(settings.mode === "pvp"){
        secondPlayer = Player("human", settings.secondPlayerName);
    }else{
        secondPlayer = Player("computer", "computer");
    }
    
    gameState.players = [firstPlayer, secondPlayer];
}
