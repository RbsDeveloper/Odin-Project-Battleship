import { Gameboard } from "./Gameboard.js"
import { generateAttackMoves } from "./utils.js";

export function Player (type, id) {

    let gameboard = Gameboard();

    const getBoard = () => {
        return gameboard
    }

    const player =  {
        get type(){
            return type
        }, 
        get id() {
            return id
        }, 
        getBoard,
    }

    if(type === "computer"){
        const computerAttackOptions = generateAttackMoves();

        player.getNextMove = function () {
           return computerAttackOptions.pop();
        }
    }

    return player
}
