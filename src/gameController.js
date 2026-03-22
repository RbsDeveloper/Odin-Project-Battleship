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