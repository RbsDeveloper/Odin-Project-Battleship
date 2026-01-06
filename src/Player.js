import { Gameboard } from "./Gameboard.js"

export function Player (type, id) {

    const gameboard = Gameboard()

    return {type, id, gameboard}
}