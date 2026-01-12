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
    const fleet = shipDetailsForCreation.map(ship => new Ship(ship.length, ship.id));

    const placeShip = (ship, direction = "vertical", [row, col]) => {

        const cellType = direction === "vertical" ? row : col;
        
        isOutOfBounds(ship, cellType);

        const coordsForShipPlacement = getCellsForPlacement(ship, direction, [row, col]);

        if(!canBePlaced(grid, coordsForShipPlacement)){
            throw new Error("Ship can't be placed: overlapping ship")
        }

        occupyCell(grid, coordsForShipPlacement, ship);
    }

    const receiveAttack = ([row, col]) => {
        if(grid[row][col].hasShip === true){
            if(!grid[row][col].isHit){
                grid[row][col].shipReference.hit();
                grid[row][col].isHit = true;
                return true;
            }else{
                throw new Error("Cell allready hit")
            }
            
        }else{
            if(grid[row][col].isHit === true) throw new Error("Cell allready hit") 
            grid[row][col].isHit = true;
            return false;
               
        }
    }

    const areAllShipSunk = () => {
        for(const ship of fleet){
            if(!ship.isSunk()) return false
        }

        return true
    }
    
    return { grid, fleet, shipDetailsForCreation, placeShip, receiveAttack, areAllShipSunk }
}

const isOutOfBounds = (shipObj, cellType) => {
    const totalCellOccupied = shipObj.length
    const lastCellOfShip = cellType + (totalCellOccupied - 1);

    if( lastCellOfShip > 9) throw new Error("Ship can't be placed out of the grid")
}

const getCellsForPlacement = (shipObj, direction, [rowCoords, colCoords]) => {

    let cellsForPlacement = [];

    if(direction === 'vertical'){
        for(let i = rowCoords; i < rowCoords + shipObj.length; i++){
            cellsForPlacement.push([i, colCoords])
        }
    }else{
        for(let i = colCoords; i < colCoords + shipObj.length; i++){
            cellsForPlacement.push([rowCoords, i])
        }
    }
    
    return cellsForPlacement
}

const canBePlaced = (gameBoard, shipCoords) => {
    for(let i = 0; i < shipCoords.length; i++){
        if(gameBoard[shipCoords[i][0]][shipCoords[i][1]].hasShip === true){
            return false
        }
    }
    return true
}

const occupyCell = (gameBoard, shipCoords, shipObj) => {
    for(let i = 0; i < shipCoords.length; i++){
        gameBoard[shipCoords[i][0]][shipCoords[i][1]].hasShip = true;
        gameBoard[shipCoords[i][0]][shipCoords[i][1]].shipReference = shipObj;
    }
}



