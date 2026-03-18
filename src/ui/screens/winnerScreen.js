import {createCompleteElement} from "../uiUtils/domHelpers.js"

export function renderWinnerDialog (winnerPlayer) {
    const winnerDialog = createCompleteElement("dialog", ["winnerDialog"], `The winner is: ${winnerPlayer}`, {id: "winnerDialog"});
    const winnerParagraph = createCompleteElement("p", ["winnerMessage"], "", {id:"winnerMessage"});
    const actions = createCompleteElement("div", ["restartBtnsContainer"], "");
    const samePlayersRestart = createCompleteElement("button", ["btn", "samePlayersRestart"], "Play Again(same players)", {id: "restartSamePlayers"});
    const newGame = createCompleteElement("button", ["btn", "newGameBtn"], "Start New Game", {id:"startNewGame"});

    actions.append(newGame, samePlayersRestart);
    winnerDialog.append(winnerParagraph, actions);

    return winnerDialog;
}