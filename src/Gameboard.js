export function Gameboard () {
    let grid = Array(10).fill(null).map(() => Array(10).fill(null));
    
    const placeShip = (ship, [row, col]) => {

        const cellStateObject = {
            occupied: true,
            shipReference: ship,
        }

        const totalCellOccupied = ship.length

        /*
            we need to grab the length of the ship
            we have to loop starting from the firs col 
            for each cell we need to set it equal to the cellStateObject

        */

        for(let i = col; i < col+totalCellOccupied; i++){
            grid[row][i] = cellStateObject;
        }

    }
    
    return { grid, placeShip }
}
