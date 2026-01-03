export function Gameboard () {
    let grid = Array(10).fill(null).map(() => Array(10).fill(null));
    
    const placeShip = (ship, direction = "vertical", [row, col]) => {

        const cellStateObject = {
            occupied: true,
            shipReference: ship,
        }

        const cellType = direction === "vertical" ? row : col;
        const totalCellOccupied = ship.length
        const lastCellOfShip = cellType + (totalCellOccupied - 1);

        if( lastCellOfShip > 9) throw new Error("Ship can't be placed out of the grid")
        
        if(direction === 'vertical'){
            for(let i = cellType; i < cellType + totalCellOccupied; i++){
            
                if(grid[i][col] !== null){
                    throw new Error("Ship can't be placed: overlapping ship")
                }
            }
        }else{
            for(let i = cellType; i < cellType + totalCellOccupied; i++){
                if(grid[row][i] !== null){
                    throw new Error("Ship can't be placed: overlapping ship")
                }
            }
        }
         
        if(direction === 'vertical'){
            for(let i = cellType; i < cellType + totalCellOccupied; i++){
                grid[i][col] = cellStateObject;
            }
            
        }else{
            for(let i = cellType; i < cellType + totalCellOccupied; i++){
                grid[row][i] = cellStateObject;
            }
        }
      
    }
    
    return { grid, placeShip }
}



