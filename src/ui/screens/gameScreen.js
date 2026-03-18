import {createCompleteElement} from "../uiUtils/domHelpers.js"
import {renderMessageDisplay} from "../components/messageLogView.js"
import { renderGameboard } from "../components/gameboardView.js";
import { renderGameStatsDisplay } from "../components/statsView.js";

export function renderGameScreen (players) {
    const mainContainer = createCompleteElement("main", [], "",);
    const header = createCompleteElement("div", ["gamePhaseHeader"]);
    const gameTitle = createCompleteElement("h1", ["gameTitle"], "Battleship");
    const subtitle = createCompleteElement("h4", ["subtitle"], "strategic naval combat")
    header.append(gameTitle, subtitle);

    const messageContainer = renderMessageDisplay()
    const interactiveArea = createCompleteElement("div", ["interactiveContainer"], "", {id: "interactiveZone"})

    const leftFleetContainer = createCompleteElement("div", ["fleetContainer"], "", {id: "leftFleet", "data-player-id": `${players[0].id}`});
    const middleContainer = createCompleteElement("div", ["gameboardsContainer"], "", {id: "boardsArea"})
    const rightFleetContainer = createCompleteElement("div", ["fleetContainer"],"", {id: "rightFleet", "data-player-id": `${players[1].id}`});
    
    interactiveArea.append(leftFleetContainer, middleContainer, rightFleetContainer);
    mainContainer.append(header, messageContainer, interactiveArea);
    return mainContainer
}

export function createPlayerBoardsArea  (boardsData) {
    const boardsDestination = document.getElementById("boardsArea");

    const leftBoard =  renderGameboard(boardsData[0]);
    const rightBoard = renderGameboard(boardsData[1]);
    const statsPanel = renderGameStatsDisplay();

    boardsDestination.append(leftBoard, statsPanel, rightBoard);
}