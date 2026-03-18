import {createCompleteElement} from "../uiUtils/domHelpers.js"

export function startDialog () {
    const dialogEl = createCompleteElement("dialog", ["startingDialog"], "", {id: "startingWindow"});
    const logoContainer = createCompleteElement("div", ["logoWrapper"]);
    const logo = createCompleteElement("i", ["fa-solid", "fa-anchor", "gameLogo"],)
    logoContainer.append(logo)
    const gameTitle = createCompleteElement("h1", ["gameTitle"], "Battleship");

    const subtitle = createCompleteElement("h4", ["subtitle"], "strategic naval combat")

    const startGameBtn = createCompleteElement('button', ["btn", "startGameBtn"], "start battle", {id: "sgBtn"});
    
    dialogEl.append(logoContainer, gameTitle, subtitle, startGameBtn);

    return dialogEl
}