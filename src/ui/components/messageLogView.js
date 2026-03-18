import {createCompleteElement} from "../uiUtils/domHelpers.js"

export function renderMessageDisplay () {
    const container = createCompleteElement("div", ["msgDisplayContainer"], "");
    const header = createCompleteElement("div", ["msgLogHeader"]);
    header.append(
        createCompleteElement("span", ["tacticalLabel"], "naval comms")
    );
    const body = createCompleteElement("div", ["msgLogBody"] ,"",  {id: "msgWrapper"});
    container.append(header, body);

    return container;
}

export function updateGameMessage (history) {
    const msgContainer = document.getElementById("msgWrapper");
    if (!msgContainer) return;
    msgContainer.innerHTML = "";
    history.forEach((log, index) => {
        const entry = createCompleteElement("div", ["logEntry", log.className]);
        
        if (index < history.length - 1) entry.style.opacity = "0.4";

        const prefix = createCompleteElement("span", ["logPrefix"], log.prefix);
        const badge = createCompleteElement("span", ["logBadge"], `[${log.label}]`);
        const text = createCompleteElement("span", ["logText"], log.message);
        
        entry.append(prefix, badge, text);
        msgContainer.append(entry);
    })
}