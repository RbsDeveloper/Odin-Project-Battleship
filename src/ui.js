import { getBoards } from "./gameController.js";
import { createCompleteElement } from "./utils.js";
/*
    UI components needed before the main game screen:

    1. Start Dialog
        - Button to start the game

    2. Game Settings Dialog
        - Select opponent type (computer or another player)
        - Enter player name
        - Optional: enter second player’s name (if PvP)
        - Next button to continue to ship placement

    3. Ship Placement Dialog
        - Ship selection interface (drag and drop or select)
        - Buttons for:
            - Random placement
            - Reset placement
            - Change orientation
        - Grid to place each ship
        - Button to save placements and start the game
*/

const startDialog = () => {
    const dialogEl = createCompleteElement("dialog", ["startingDialog"], "", {id: "startingWindow"});
    const gameTitle = createCompleteElement("h1", ["gameTitle"], "Battleship");
    const startGameBtn = createCompleteElement('button', ["btn", "startGameBtn"], "Start Game", {id: "sgBtn"});
    
    dialogEl.append(gameTitle, startGameBtn);

    return dialogEl
}

const gameSettingsDialog = () => {
    const dialogEl = createCompleteElement("dialog", ["settingsDialog"], "", {id: "settingsWindow"});
    const formEl = createCompleteElement("form", ["settingsForm"], "", {id: "gameSettingsForm"});

    //elements inside the form

    //radio inputs for players
    const fieldsetForBtns = createCompleteElement('fieldset');
    const legend =  createCompleteElement('legend', [], "Choose your opponent")
    const firstLabel = createCompleteElement("label", [], "Player vs Computer", {for: "pvcMode"});
    const firstInput = createCompleteElement("input", [], "", {type: "radio", value: "pvc", id: "pvcMode", name: "mode",});
    firstInput.checked = true;
    const secondLabel = createCompleteElement("label", [], "Player vs Player", {for: "pvpMode"});
    const secondInput = createCompleteElement("input", [], "", {type: "radio", value: "pvp", id: "pvpMode", name: "mode",});

    fieldsetForBtns.append(legend, firstLabel, firstInput, secondLabel, secondInput);

    //Name input
    const thirdLabel = createCompleteElement("label", [], "Player name:", {for: "firstPlayerInput"});
    const nameInput = createCompleteElement("input", [], "", {type: "text", name: "firstPlayerName", id:"firstPlayerInput",});
    nameInput.required = true;
    

    //Optional second name input
    const forthLabel = createCompleteElement("label", [], "Second player name:", {id: "secondPlayerLabel", for: "secondPlayerINput"});
    const secondNameInput = createCompleteElement("input", [], "", {type: "text", id:"secondPlayerInput", name: "secondPlayerInput",})

    const submitBtn = createCompleteElement("button", ["btn", "formSubmitBtn"], "Next", {type: "submit"});

    formEl.append(fieldsetForBtns, thirdLabel,nameInput, forthLabel, secondNameInput, submitBtn);
    dialogEl.append(formEl);

    return dialogEl;

}

const playerBoardsArea = () => {
    const main = createCompleteElement("main");
    const boardsData = getBoards();
    
    boardsData.forEach(playerGrid => {
        main.append(renderGameboard(playerGrid));
    });
    
    return main
}

const renderGameboard = (grid) => {

    const boardContainer = createCompleteElement('div', ['board'], '', {'data-player-id': grid.id})
    
    boardContainer.addEventListener('click', (e) => {
        if(!e.target.classList.contains('cell')) return 

        console.log(e.target)
        
        const row = e.target.dataset.row
        const col = e.target.dataset.col
        const playerId = boardContainer.dataset.playerId

        return console.log({row, col, playerId})
    })

    createCells(boardContainer, grid.grid);

    return boardContainer;
}

const createCells = (container, board) => {
    for(let i = 0 ; i < board.length; i++){

        for(let j = 0; j < board[i].length ; j++){

            const cell = createCompleteElement('div', ['cell'], '', {"data-row": `${i}`, "data-col": `${j}`})

            container.append(cell);

        }

    }
}

export const createLayout = () => {
    const content = document.getElementById("content");

    content.append(playerBoardsArea())
}



