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
        const possibleEnemyShipPosition = [];

        player.getNextMove = function () {
            while(true){
                let nextTarget

                if(possibleEnemyShipPosition.length > 0){
                    nextTarget = possibleEnemyShipPosition.pop();
                
                    const index = computerAttackOptions.findIndex(coord => coord.row === nextTarget.row && coord.col === nextTarget.col);
                    if(index !== -1) computerAttackOptions.splice( index, 1)
                
                    return nextTarget;
                }else{
                    return computerAttackOptions.pop();
                }
            }

        }

        player.addAdjacentCells = function (coords) {
            const {row, col} = coords;

            const directions = [
                [row-1, col],
                [row+1, col],
                [row, col-1],
                [row, col+1],
            ]

            directions.forEach(([r,c]) => {
                const index = computerAttackOptions.findIndex(coord => coord.row === r && coord.col === c );

                if(index !== -1){
                    const alreadyInsideTargetQueue = possibleEnemyShipPosition.some(p => p.row === r && p.col === c);
                    if(!alreadyInsideTargetQueue){
                        possibleEnemyShipPosition.push({row:r, col:c});
                    }
                }
            })
        }

        player.clearTargetingQueue = function () {
            possibleEnemyShipPosition.forEach(coord => {
                computerAttackOptions.splice(Math.floor(Math.random() * (computerAttackOptions.length +1)), 0, coord)
            })
            possibleEnemyShipPosition.length = 0;
        }
    }

    return player
}
