import { Gameboard } from "../src/Gameboard.js";
import { Player } from "../src/Player.js";

let humanPlayer;
let computerPlayer; 

beforeEach(() => {
    
    humanPlayer = Player("human", "first");
    computerPlayer = Player("computer", "second");

})

describe("Check the right initialization of the players", () => {
    
    test("Check if the player object has a type and an id", () => {

        expect(humanPlayer.type).toBe('human')
        expect(humanPlayer.id).toBe('first')
        expect(computerPlayer.type).toBe('computer')
        expect(computerPlayer.id).toBe('second')

    });

    test("Check if the player object has a gameboard", () => {
        expect(humanPlayer.gameboard).toBeDefined();
        expect(computerPlayer.gameboard).toBeDefined();
        expect(humanPlayer.gameboard.grid.length).toBe(10);
        expect(computerPlayer.gameboard.grid.length).toBe(10);
    })
})

describe("Placing attacks", () => {

    test("attack an empty cell", () => {
        humanPlayer.attackEnemy([0,0], computerPlayer);

        expect(computerPlayer.gameboard.grid[0][0]).toEqual({
            hasShip: false,
            shipReference: null,
            isHit: true,
        })
    })
    
})