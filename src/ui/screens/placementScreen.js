import {createCompleteElement} from "../uiUtils/domHelpers.js"
import {renderMessageDisplay} from "../components/messageLogView.js"

export function renderPlacementScreen () {
    const mainContainer = createCompleteElement("main", [], "",);
    const header = createCompleteElement("div", ["placementHeader"]);
    const subtitle = createCompleteElement("h4", ["subtitle"], "naval command system");
    const title = createCompleteElement("h2", ["lobbyTitle"], "Placement Phase");
    header.append(subtitle, title)

    const messageContainer = renderMessageDisplay()

    const interactiveArea = createCompleteElement("div", ["interactiveContainer"], "", {id: "interactiveZone"})

    const fleetPlacementContainer = createCompleteElement("div", ["fleetContainer"], "", {id: "fleetPlacementControls"});
    const gridContainer = createCompleteElement("div", ["placementBoardContainer"], "", {id: "placementArea"})
    interactiveArea.append(fleetPlacementContainer, gridContainer);
    mainContainer.append(header, messageContainer, interactiveArea);

    return mainContainer;
}

//creates the container where the ships and btn controlls are stored for placement
export function createShipPlacementUi  (identityParam, gameMode, playerIdx) {

    //SECTION 01: FLEET SELECTOR
    const placementContainer = createCompleteElement("div", ["placementContainer"]);
    const fleetLabel = createCompleteElement("p", ["sectionLabel"], "01 - Fleet Manifest")
    const fleetSelector = createCompleteElement("div", ["shipContainer"], "", {"data-player-id": `${identityParam}`});
    const placementControls = createCompleteElement("div", ["btnContainer"], "", {"data-player-id": `${identityParam}`});
    fleetSelector.append(fleetLabel)

    //DIVIDER
    const divider = createCompleteElement("div", ["sidebarDivider"]);
    divider.append(
        createCompleteElement("span",  ["line"]),
        createCompleteElement("span", ["centerDot"]),
        createCompleteElement("span", ["line"]),
    );


    //SECTION 02: ORIENTATION

    const section02 = createCompleteElement("div", ["uiSection"]);
    const orientationLabel = createCompleteElement("p", ["sectionLabel"], "02 - Orientation");
    const orientationBtnsGroup = createCompleteElement("div", ["controlGroup"]);

    const horizontalBtn = createCompleteElement("button", ["controlBtn"], "Horiz", {id:"horizBtn"})
    horizontalBtn.prepend(createCompleteElement("i", ["fa-solid", "fa-arrow-right"]));
    const verticalBtn = createCompleteElement("button", ["controlBtn"], "Vert", {id:"vertBtn"})
    verticalBtn.prepend(createCompleteElement("i", ["fa-solid", "fa-arrow-down"]));
    if(gameState.shipDirection==='horizontal'){
        horizontalBtn.classList.add("active");
    }else if (gameState.shipDirection==="vertical"){
        verticalBtn.classList.add("active");
    }

    orientationBtnsGroup.append(horizontalBtn, verticalBtn);
    section02.append(orientationLabel, orientationBtnsGroup);

    //SECTION 03: ACTIONS 

    const section03 = createCompleteElement("div", ["uiSection"]);
    const actionsLabel = createCompleteElement("div", ["sectionLabel"], "03 - Actions");
    const actionsBtnsGroup = createCompleteElement("div", ["controlGroup"]);

    const randomBtn = createCompleteElement("button", ["actionBtn"], "Random", {id: "randomPlacementBtn"});
    randomBtn.prepend(createCompleteElement("i", ["fa-solid", "fa-shuffle"]))
    const resetBtn = createCompleteElement("button", ["actionBtn"], "Clear", {id: "resetBtn"});
    resetBtn.prepend(createCompleteElement("i", ["fa-solid", "fa-trash-can"]))

    actionsBtnsGroup.append(randomBtn, resetBtn);
    section03.append(actionsLabel, actionsBtnsGroup);

    //LAUNCH GAME WRAPPER

    const launchWrapper = createCompleteElement("div", ["launchWrapper"]);
    const launchBtn = createCompleteElement("button", ["btn", "confirmBtn"], "Launch Battle", {id: "confirmPlacementBtn", disabled: true});
    launchWrapper.append(launchBtn);
    
    placementControls.append(divider, section02, section03, launchWrapper);
    placementContainer.append(fleetSelector, placementControls);

    return placementContainer
}