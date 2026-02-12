import { gameState } from "./gameState.js";
import { fireActionBasedOnBtnTarget, initializePlacementUI, pvpRound, runRound, triggerPhase } from "./gameController.js";
import { isPlacementCompleted, selectShip, placeRandomFleet, attemptShipPlacement } from "./placementController.js";
import { clearPlacementComponents, disableConfirmBtn, enableConfirmBtn, renderGameScreen } from "./ui.js";

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
        attemptShipPlacement(row, col);
        if(isPlacementCompleted(gameState.players[gameState.currentPlayer])) enableConfirmBtn();
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

export function proceedToSecondPlayerPlacement (element) {
    element.addEventListener("click", ()=> {
        console.log("clicked")
        gameState.currentPlayer = 1;
        disableConfirmBtn()
        clearPlacementComponents()
        initializePlacementUI()
        enterGamePhaseForPvP(element)
    },
{once: true})
}

function enterGamePhaseForPvP (element) {
    element.addEventListener("click", ()=> {
        triggerPhase("game");
    })
}

export function enterGamePhaseForPvC (element) {
    element.addEventListener("click", ()=> {
        gameState.currentPlayer = 1;
        placeRandomFleet();
        triggerPhase("game");
    })
}

export function attachComputerBoardClicks (element) {
    element.addEventListener("click", (e) => {
        runRound(e.target)
    })
}

export function attachEventForPvpMatch (element) {
    element.addEventListener("click", (event) => {
        console.log(event.target);
        pvpRound(event.target);
    })
}