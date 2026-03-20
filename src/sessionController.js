import { startDialog, clearWindow, createLobby, createSecondPlayerGroup, removeSecondPlayerGroup } from "./ui/index.js";
import { attachFormEventListener, setUpModeToggle, attachValidationListener } from "./events.js";
import { gameState, resetGameState } from "./gameState.js";
import { triggerPhase, initGame } from "./gameController.js";


export function enterStartPhase () {
    document.body.append(startDialog())
    const modal = document.getElementById("startingWindow");
    modal.show()
}

export function handleStartClick (event){
    const button = event.target;
    button.remove();
    triggerPhase("settings")
}

export function enterSettingsPhase () {
    const modal = document.getElementById("startingWindow");
    modal.innerHTML = "";
    const lobby = createLobby();
    lobby.forEach(el => modal.append(el))
    handleLobbyGameModeSwitch()
    const form = modal.querySelector("form");
    attachValidationListener(form, handleFormValidation);
    attachFormEventListener(form, handleSubmitClick);
}

function manageLobbyInternals (e) {
    const btnEl = e.target.closest("button");
        const hiddenInput = document.getElementById("modeInput");

        if(!btnEl) return;

        const btnsCollection = document.querySelectorAll(".modeCardBtn");
        btnsCollection.forEach(b => b.classList.remove("activeMode"))

        btnEl.classList.add("activeMode");
        hiddenInput.value = btnEl.dataset.mode;

        if (hiddenInput.value === "pvp"){
            if(!document.getElementById("secondPlayerInput")) {

                const playersSection = document.querySelector(".playersSection")
                playersSection.append(createSecondPlayerGroup())
            }
        }else{
            removeSecondPlayerGroup()
        }
}

function handleLobbyGameModeSwitch () {
    const btnWrapper = document.querySelector(".modeOptions");
    setUpModeToggle(btnWrapper, manageLobbyInternals)
}

function handleFormValidation (e) {
    const form = e.currentTarget;
    const submitBtn = document.querySelector(".formSubmitBtn");

    if(form.checkValidity()){
        submitBtn.disabled = false;
        submitBtn.classList.add("submitReady");
    }else{
        submitBtn.disabled = true;
        submitBtn.classList.remove("submitReady")
    }
}

function handleSubmitClick (e) {
    e.preventDefault();
    const formElement = e.target
    const formData = new FormData(formElement);
    const modal = document.getElementById("startingWindow")
    modal.close();
    modal.remove();
    gameState.settings = Object.fromEntries(formData);
    triggerPhase("placement");
}

export function handleNewGame () {
    clearWindow();
    resetGameState(true)
    initGame()
}

export function handlePlayAgain () {
    clearWindow();
    resetGameState();
    triggerPhase("placement")
}