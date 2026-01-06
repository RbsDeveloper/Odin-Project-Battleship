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
        
    })
})