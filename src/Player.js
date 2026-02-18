import { Gameboard } from "./Gameboard.js"

export function Player (type, id) {

    let gameboard = Gameboard();

    const getBoard = () => {
        return gameboard
    }

    return {
        get type(){
            return type
        }, 
        get id() {
            return id
        }, 
        getBoard,
    }
}