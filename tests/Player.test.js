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
        expect(humanPlayer.getBoard()).toBeDefined();
        expect(computerPlayer.getBoard()).toBeDefined();
        expect(humanPlayer.getBoard().grid.length).toBe(10);
        expect(computerPlayer.getBoard().grid.length).toBe(10);
    })
})

