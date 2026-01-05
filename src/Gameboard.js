export function Gameboard () {
    let grid = Array(10).fill(null).map(() => Array(10).fill(null).map(() =>({
        hasShip: false,
        shipReference: null,
        isHit: false,
    })));
    let shipStore = {};

    const placeShip = (ship, direction = "vertical", [row, col]) => {

        const cellType = direction === "vertical" ? row : col;
        
        isOutOfBounds(ship, cellType);

        const coordsForShipPlacement = getCellsForPlacement(ship, direction, [row, col]);

        if(!canBePlaced(grid, coordsForShipPlacement)){
            throw new Error("Ship can't be placed: overlapping ship")
        }

        occupyCell(grid, coordsForShipPlacement, ship);

        shipStore[ship.id] = ship;
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

    const areAllShipSunk = (obj) => {
        for(let key in obj){
            if(obj[key].isSunk() === false){
                return false;
            }
        }

        return true
    }
    
    return { grid, shipStore, placeShip, receiveAttack, areAllShipSunk }
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


