import {createCompleteElement} from "../uiUtils/domHelpers.js"

export function createLobby () {
    const subtitle = createCompleteElement("h4", ["subtitle"], "naval command system");
    const title = createCompleteElement("h2", ["lobbyTitle"], "Mission briefing");

    const formEl = createCompleteElement("form", ["settingsForm"], "", {id: "btnFieldset"});
    const gameModeSection = createCompleteElement("section", ["modeSection"]);
    const gameModeLabel = createCompleteElement("p", ["sectionLabel"], "01 - Select Game Mode");
    const modeOptionsWrapper = createCompleteElement("div", ["modeOptions"]);

    const pvcBtn = createModeBtn(
        '<i class="fa-solid fa-desktop"></i>', 
        "solo", 
        "vs Computer", 
        "Challenge the AI opponent", 
        "pvc"
    );

    const pvpBtn = createModeBtn(
        '<i class="fa-solid fa-user-group"></i>', 
        "local", 
        "vs Player", 
        "Pass & play on a device", 
        "pvp"
    );
    
    modeOptionsWrapper.append(pvcBtn, pvpBtn);

    const hiddenInput = createCompleteElement("input", [], "", {type: "hidden", id: "modeInput", name: "mode", value: "pvc"});
    gameModeSection.append(gameModeLabel, modeOptionsWrapper, hiddenInput);

    const playersInfoSection = createCompleteElement("section", ["playersSection"]);
    const playerInfoLabel = createCompleteElement("p", ["sectionLabel"], "02 - Commander");

    const firstPlayerGroup = createCompleteElement("div", ["inputGroup"]);
    const firstPlayerLabel = createCompleteElement("label", [], "", {for:"firstPlayerInput"});
    const firstPlayerNameInput = createCompleteElement("input", [], "", {type: "text", name: "firstPlayerName", id:"firstPlayerInput", placeholder:"Your callsign", required: true, autocomplete: "off"});

    firstPlayerGroup.append(firstPlayerLabel, firstPlayerNameInput);
    playersInfoSection.append(playerInfoLabel, firstPlayerGroup);

    const submitBtn = createCompleteElement("button", ["btn", "formSubmitBtn"], "Deploy fleet", {type: "submit", disabled: true});

    formEl.append(gameModeSection, playersInfoSection, submitBtn);

    return [subtitle, title, formEl];
}

export function createSecondPlayerGroup () {
    const secondPlayerGroup = createCompleteElement("div", ["inputGroup"]);
    const secondPlayerLabel = createCompleteElement("label", [], "", {for:"secondPlayerInput"});
    const secondPlayerNameInput = createCompleteElement("input", [], "", {type: "text", name: "secondPlayerName", id:"secondPlayerInput", placeholder:"Player 2 name", required: true, autocomplete: "off"});
    secondPlayerGroup.append(secondPlayerLabel, secondPlayerNameInput);
    
    return secondPlayerGroup
}

export function removeSecondPlayerGroup () {
    const input = document.getElementById("secondPlayerInput")
    if(input) input.closest(".inputGroup").remove()
}

function createModeBtn(iconHtml, tag, title, desc, modeValue) {
    const btn = createCompleteElement("button", ["modeCardBtn"], "", { 
        type: "button", 
        "data-mode": modeValue 
    });

    if(modeValue === "pvc"){
        btn.classList.add("activeMode")
    }

    const btnIcon = createCompleteElement("div", ["modeIcon"],);
    btnIcon.innerHTML = iconHtml;
    const modeTag = createCompleteElement("span", ["modeTag"], tag);
    const modeTitle = createCompleteElement("span", ["modeTitle"], title);
    const modeDescription = createCompleteElement("span", ["modeDescription"], desc);

    btn.append(btnIcon, modeTag, modeTitle, modeDescription);
    return btn;
}