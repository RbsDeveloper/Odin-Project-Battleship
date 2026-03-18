import {createCompleteElement} from "../uiUtils/domHelpers.js"

export function buildShip (shipDetails, destination) {

    shipDetails.forEach(item => {
        const build = createCompleteElement("div", ["ship"], "", {id: `${item.id}`, draggable: true});
        build.innerHTML = `<span class="dot"></span> <span class="shipName">${item.id}</span>`
        const sizeWrapper = createCompleteElement("div", ["sizeWrapper"]);
        const sizeBar = createCompleteElement("div", ["sizeBar"]);
        const multiplier = createCompleteElement("span", ["multiplier"], `x${item.length}`);
        sizeWrapper.append(sizeBar, multiplier);
        for(let i=0; i<item.length; i++){
            sizeBar.appendChild(createCompleteElement("div", ["sizeBlock"]))
        }
        build.append(sizeWrapper)
        destination.append(build);
    })   
}

export function markShipAsPlaced (shipId) {
    const shipEl = document.getElementById(shipId);
    if(shipEl){
        shipEl.classList.add("placed");
        shipEl.classList.remove("active");
    }
}

export function toggleActiveClassOnShips(newActive, oldShip = null) {
    if (oldShip) {
        document.getElementById(oldShip).classList.remove("active");
    }
    document.getElementById(newActive).classList.add("active");
}
