import { gameState, triggerPhase } from "./gameController.js";

export function attachStartBtnLister (element) {
    
    element.addEventListener("click", () => {   
        element.remove();
        triggerPhase("settings");
    })

}