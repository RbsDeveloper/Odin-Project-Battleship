import { Gameboard } from "./Gameboard.js"

export function Player (type, id) {

    let gameboard = Gameboard();

    const attackEnemy = ([x,y], enemy) => {
        enemy.gameboard.receiveAttack([x,y])
    }

    const clearGameboard = () => {
        gameboard = Gameboard();
    }

    const getBoard = () => {
        return gameboard
    }

    return {type, id, attackEnemy, clearGameboard, getBoard}
}