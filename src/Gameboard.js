export function Gameboard () {
    let grid = Array(10).fill(null).map(() => Array(10).fill(null));
    
    const placeShip = (ship, [row, col]) => {

        const cellStateObject = {
            occupied: true,
            shipReference: ship,
        }

        const totalCellOccupied = ship.length

        for(let i = col; i < col+totalCellOccupied; i++){
            grid[row][i] = cellStateObject;
        }

    }
    
    return { grid, placeShip }
}
