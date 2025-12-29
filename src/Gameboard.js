export function Gameboard () {
    let grid = Array(10).fill(null).map(() => Array(10).fill(null));
    
    const placeShip = (ship, [row, col]) => {
        grid[row][col] = {
            occupied: true,
            shipReference: ship,
        }
    }
    
    return { grid, placeShip }
}
