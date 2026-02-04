import { gameState } from "./gameState.js";
import { fireActionBasedOnBtnTarget, triggerPhase } from "./gameController.js";
import { selectShip, tryPlaceActiveShip } from "./placementController.js";

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
        const targetEl = event.target;
        if(targetEl.classList.contains("ship")){
            console.log(event.target)
            selectShip(targetEl.id);
        }
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

export function attachPlacementBtnsEventListener (element) {
    element.addEventListener("click", (event) => {
        console.log(event)
        let target = event.target;
        if(target.id){
            console.log("it has an Id");
            fireActionBasedOnBtnTarget(target.id);
        }else{
            console.log("No Id here");
        }
    })
}