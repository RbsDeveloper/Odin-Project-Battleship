import { gameState } from "./gameState.js";
import { enterStartPhase,enterSettingsPhase, handleStartClick } from "./sessionController.js";
import { enterPlacementPhase } from "./placementController.js";
import { enterGamePhase, enterWinnerPhase } from "./combatPhase.js";


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
}