export function Gameboard () {
    let grid = Array(10).fill(null).map(() => Array(10).fill(null));
    
    const placeShip = (ship, [row, col]) => {

        const cellStateObject = {
            occupied: true,
            shipReference: ship,
        }

        const totalCellOccupied = ship.length
        const lastCellOfShip = col + (totalCellOccupied - 1);

        if( lastCellOfShip > 9){
            throw new Error("Ship can't be placed out of the grid")
        }else{

            let areCellsFree = true;
            
            for(let i = col; i < col+totalCellOccupied; i++){
                if(grid[row][i] !== null){
                    areCellsFree = false;
                    throw new Error("Ship can't be placed: overlapping ship")
                }
            }

            
            for(let i = col; i < col+totalCellOccupied; i++){
                grid[row][i] = cellStateObject;
            }   
            
        }

    }
    
    return { grid, placeShip }
}
