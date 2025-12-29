import { Gameboard } from "../src/Gameboard.js";
import { Ship } from "../src/Ship.js";
let gameBoard;

beforeEach(()=> {
    gameBoard = Gameboard();
})

describe("Gameboard creation", () => {
    test("creates a 10x10 grid", ()=> {
        expect(gameBoard.grid.length).toBe(10);
    })  

    test("Each row has 10 cells", ()=> {
        expect(gameBoard.grid[0].length).toBe(10);
    })

    test("All cells are initially empty", () => {
        gameBoard.grid.forEach(row => {
            row.forEach(cell => expect(cell).toBeNull())
        })
    })
})

describe("Placing ships", () => {
    test("Placing 1 lengthed ship", () => {
        const firstShip = Ship(1);
        gameBoard.placeShip(firstShip, [4,4])
        expect(gameBoard.grid[4][4]).toEqual({occupied: true})
    })
})