import {createCompleteElement} from "../uiUtils/domHelpers.js"

export function renderFleetStatus (owner, destination ) {
    const title = createCompleteElement("h3", ["fleetTitle"], `${owner.id}'s Fleet`,);
    const shipConstructionPlans = owner.getBoard().shipDetailsForCreation;
    destination.append(title)

    shipConstructionPlans.forEach(ship => {
            destination.append(createShipCard(ship))
    })
}

function createShipCard (shipReference) {
    const card = createCompleteElement("div", ["shipCard"], "", {"data-ship-id": `${shipReference.id}`});
    const header = createCompleteElement("div", ["cardHeader"]);
    const shipName = createCompleteElement("p", ["shipName"], `${shipReference.id}`);
    const hpPoints = createCompleteElement("span", ["hpPoints"], `${shipReference.length}`);
    const shipContainer = createCompleteElement("div", ["shipHp"]);
    createHitPoints(shipReference.length, shipContainer);

    header.append(shipName, hpPoints);
    card.append(header, shipContainer);

    return card;
}

export function updateShipCard (hpNum, healthPointsDivs) {
    const currentHp = parseInt(hpNum.textContent) - 1;
    hpNum.textContent = currentHp;
    healthPointsDivs[parseInt(hpNum.textContent)].classList.add("hit")
    if(currentHp === 0){
        hpNum.closest(".shipCard").classList.add("sunk")
    }
}

function createHitPoints(length, destination){
    for(let i = 0; i< length; i++){
        destination.append(createCompleteElement("div", ["hpPoint"]))
    }
}