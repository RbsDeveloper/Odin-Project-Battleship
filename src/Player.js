import { Gameboard } from "./Gameboard.js"

export function Player (type, id) {

    const gameboard = Gameboard();

    const attackEnemy = ([x,y], enemy) => {
        enemy.gameboard.receiveAttack([x,y])
    }

    return {type, id, gameboard, attackEnemy}
}