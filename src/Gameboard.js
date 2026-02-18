import { Ship } from "./Ship.js";

export function Gameboard () {
    let grid = Array(10).fill(null).map(() => Array(10).fill(null).map(() =>({
        hasShip: false,
        shipReference: null,
        isHit: false,
    })));

    const shipDetailsForCreation = [
        { id: "Carrier", length: 5, },
        { id: "Battleship",length: 4, },
        { id: "Cruiser",length: 3, },
        { id: "Submarine",length: 3, },
        { id: "Destroyer",length: 2, },
    ];

    //Creates the ships instances using the details from shipDetails array
    let fleet = shipDetailsForCreation.map(ship => new Ship(ship.length, ship.id));

    const calculateCoords = (shipLength, direction, [row, col]) => {
        const coords = [];
        for(let i = 0; i < shipLength; i++){
            coords.push(direction === "vertical" ? [row + i, col] : [row, col+i])
        }

        return coords;
    }

    const checkCoordsValidity = (coords) => {
        for(const [r,c] of coords){
            if(r<0 || r>=10 || c<0 || c>=10){
                return {valid: false, reason: "Ship can't be placed out of the grid."}
            }else if (grid[r][c].hasShip){
                return {valid: false, reason: "Ship collision! You can't stack vessels."}
            }
        }
        return {valid: true}
    }

    const placeShip = (ship, direction, [row, col]) => {
        
        const coords = calculateCoords(ship.length, direction, [row, col])
        const report = checkCoordsValidity(coords);

        if(!report.valid) throw new Error (report.reason);

        coords.forEach(([r,c]) => {
            grid[r][c].hasShip = true;
            grid[r][c].shipReference = ship
        });

        ship.setPlaced();
        return coords;
    }

    const receiveAttack = ([row, col]) => {
        const cell = grid[row][col];

        if(cell.isHit) return null;
        
        cell.isHit = true;

        if(cell.hasShip){
            cell.shipReference.hit();
            return "hit"
        }

        return "miss"
    }

    const areAllShipSunk = () => {
        for(const ship of fleet){
            if(!ship.isSunk()) return false
        }

        return true
    }

    const getValidPlacement = (ship, direction, [row, col]) => {
        const coords = calculateCoords(ship.length, direction, [row,col]);
        return checkCoordsValidity(coords).valid ? coords : null;
    }

    const getPreviewCoords = (ship, direction, [row,col]) => {
        return calculateCoords(ship.length, direction, [row, col]);
    }

    const reset = () => {
        grid = Array(10).fill(null).map(() => Array(10).fill(null).map(() =>({
            hasShip: false,
            shipReference: null,
            isHit: false,
        })));

        fleet = shipDetailsForCreation.map(ship => new Ship(ship.length, ship.id));
    }
    
    return { 
        get grid() {
            return grid
        }, 
        fleet, 
        shipDetailsForCreation, 
        placeShip, 
        receiveAttack, 
        areAllShipSunk,
        getPreviewCoords,
        getValidPlacement,
        reset,    
    }
}




