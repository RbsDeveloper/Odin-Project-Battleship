import { Player } from "./Player.js";
import { Ship } from "./Ship.js";

export const initGame = () => {
    const firstPlayer = new Player('human', 'first');
    const secondPlayer = new Player('computer', 'second');

    //initial hardcoded ships

    const firstShip = new Ship(1, 'carrier');
    const secondShip = new Ship(2, 'destroyer');
    const thirdShip = new Ship(3, 'cruiser');
    const forthShip = new Ship(4, 'submarine');
    const fifthShip = new Ship(5, 'battleship');

    firstPlayer.gameboard.placeShip(firstShip,"horizontal", [0,1])
    firstPlayer.gameboard.placeShip(secondShip,"horizontal", [2,1])
    firstPlayer.gameboard.placeShip(thirdShip,"horizontal", [4,1])
    firstPlayer.gameboard.placeShip(forthShip,"horizontal", [6,1])
    firstPlayer.gameboard.placeShip(fifthShip,"horizontal", [9,1])

    const firstCompShip = new Ship(1, 'carrier');
    const secondCompShip = new Ship(2, 'destroyer');
    const thirdCompShip = new Ship(3, 'cruiser');
    const forthCompShip = new Ship(4, 'submarine');
    const fifthCompShip = new Ship(5, 'battleship');

    secondPlayer.gameboard.placeShip(firstCompShip,"horizontal", [0,1])
    secondPlayer.gameboard.placeShip(secondCompShip,"horizontal", [2,1])
    secondPlayer.gameboard.placeShip(thirdCompShip,"horizontal", [4,1])
    secondPlayer.gameboard.placeShip(forthCompShip,"horizontal", [6,1])
    secondPlayer.gameboard.placeShip(fifthCompShip,"horizontal", [9,1])




    function getBoards () {
        const players = [firstPlayer, secondPlayer];
        const grids = players.map(player => {
            return player.gameboard.grid.map(row => row.map(cell => ({...cell})))
        })

        return grids;
    }

    return { getBoards }
}