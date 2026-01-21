import { gameState, selectShip, triggerPhase, tryPlaceActiveShip } from "./gameController.js";

export function attachStartBtnLister (element) {
    
    element.addEventListener("click", () => {   
        element.remove();
        triggerPhase("settings");
    })
}

export function attachFormEventListener (element, elementToRemove) {
    element.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(element);
        elementToRemove.close();
        elementToRemove.remove();
        gameState.settings = Object.fromEntries(formData);
        triggerPhase("placement");
    })
}

export function attachActiveShipEventListener (element) {
    element.addEventListener("click", (event) => {
    
        const targetedShip = event.target.id
        console.log(targetedShip)
        selectShip(targetedShip);
    })
}

export function attachBoardEventListener (element) {
    element.addEventListener("click", (event) => {
        
        const row = parseInt(event.target.getAttribute("data-row"));
        const col = parseInt(event.target.getAttribute("data-col"));
        console.log(row, col)
        tryPlaceActiveShip(row, col);
    })
}