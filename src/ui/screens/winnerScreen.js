import {createCompleteElement} from "../uiUtils/domHelpers.js"

export function renderWinnerDialog (winnerPlayer) {
    const winnerDialog = createCompleteElement("dialog", ["winnerDialog"], "", {id: "winnerDialog"});
    const dialogTitle =  createCompleteElement("h2", ["endGameTitle"], "battle concluded!")
    const winnerParagraph = createCompleteElement("p", ["winnerMessage"], "The winner is:", {id:"winnerMessage"});
    const winnerIdSpan = createCompleteElement("span", ["winnerSpanId"], `[${winnerPlayer}]`);
    winnerParagraph.append(winnerIdSpan);
    const actions = createCompleteElement("div", ["restartBtnsContainer"], "");
    const samePlayersRestart = createCompleteElement("button", ["btn", "samePlayersRestart"], "Play Again", {id: "restartSamePlayers"});
    const newGame = createCompleteElement("button", ["btn", "newGameBtn"], "New Game", {id:"startNewGame"});

    actions.append(newGame, samePlayersRestart);
    winnerDialog.append(dialogTitle, winnerParagraph, actions);

    return winnerDialog;
}