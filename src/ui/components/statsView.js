import {createCompleteElement} from "../uiUtils/domHelpers.js"

export function renderGameStatsDisplay () {
    const container = createCompleteElement("div", ["battleStats"]);
    const header = createCompleteElement("div", ["header"]);
    const activeTurnLabel = createCompleteElement("p", ["sectionLabel"], "01 - active turn");
    const activePlayerWrapper = createCompleteElement("div", ["playerWrapper"]);
    const statusDot = createCompleteElement("span", ["statusDot"]);
    const playerTag = createCompleteElement("p", ["playerTag"], "", {id:"gameStatsPlayerTag"});
    const instruction = createCompleteElement("span", ["turnInstruction"], "Select target on enemy grid");
    activePlayerWrapper.append(statusDot, playerTag);
    header.append(activeTurnLabel, activePlayerWrapper, instruction);

    const body = createCompleteElement("div", ["gameStatsBody"]);
    const label = createCompleteElement("p", ["sectionLabel"], "02 - accuracy");
    body.append(label);
    gameState.players.forEach(p => body.append(createAccuracyRow(p)));
    
    container.append(header, body);

    return container
} 

export function updateGameStatsHeader (player) {
    const activePlayer = document.getElementById("gameStatsPlayerTag");
    const playerWrapper = document.querySelector(".playerWrapper");

    if(player.id === "computer"){
        playerWrapper.classList.add("computer")
    }else{
        if(playerWrapper.classList.contains("computer")){
            playerWrapper.classList.remove("computer")
        }
    }
    activePlayer.textContent = `${player.id}`;
}

export function updateGameStatsBody (player, attackResult) {
    const playerAccuracyRow = document.querySelector(`.statRow[data-player-id="${player.id}"]`);
    const shots = playerAccuracyRow.querySelector(".accuracyShots");
    const playerBarFill = playerAccuracyRow.querySelector(".accuracyBarFill");
    const hitsSpan = playerAccuracyRow.querySelector(".accuracyHits")
    const missesSpan = playerAccuracyRow.querySelector(".accuracyMisses")
    const percentSpan = playerAccuracyRow.querySelector(".accuracyPercent")

    if(attackResult === "hit" || attackResult === "sunk"){
        hitsSpan.textContent = `${player.hits}H` 
    }

    if(attackResult === "miss"){
        missesSpan.textContent = `${player.misses}M`
    }
    shots.textContent = `${player.getTotalShots()} shots`
    playerBarFill.style.width = `${player.getAccuracy()}%`
    percentSpan.textContent = `${player.getAccuracy()}%`

}

function createAccuracyRow (player) {
    const playerStatRow = createCompleteElement("div", ["statRow"], "", {"data-player-id": `${player.id}`});
    const rowHeader = createCompleteElement("div", ["accuracyHeader"]);
    const name = createCompleteElement("span", ["accuracyName"], `${[player.id]}`);
    const shots = createCompleteElement("span", ["accuracyShots"], '0 shots');
    rowHeader.append(name,shots);
    const bar = createCompleteElement("div", ["accuracyBar"]);
    const fill = createCompleteElement("div", ["accuracyBarFill"]);
    bar.append(fill);
    const footer = createCompleteElement("div", ["accuracyFooter"]);
    const hits = createCompleteElement("span", ["accuracyHits"], "0H");
    const misses = createCompleteElement("span", ["accuracyMisses"], "0M");
    const percent = createCompleteElement("span", ["accuracyPercent"], "0%");
    footer.append(hits, misses, percent);
    playerStatRow.append(rowHeader, bar, footer);

    return playerStatRow;
}