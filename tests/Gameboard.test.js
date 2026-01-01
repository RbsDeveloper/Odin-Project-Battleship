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
        const firstShip = new Ship(1);
        gameBoard.placeShip(firstShip, [4,4])
        expect(gameBoard.grid[4][4]).toEqual({
            occupied: true,
            shipReference: firstShip,
        })
    })

    test("Placing a ship with a larger length", () => {
        const largerShip = new Ship(3);
        gameBoard.placeShip(largerShip, [5,5]);
        expect(gameBoard.grid[5][5]).toEqual({
            occupied: true,
            shipReference: largerShip,
        })
        expect(gameBoard.grid[5][6]).toEqual({
            occupied: true,
            shipReference: largerShip,
        })
        expect(gameBoard.grid[5][7]).toEqual({
            occupied: true,
            shipReference: largerShip,
        })
    })

    test("Place a ship that go outside the board", () => {
        const largeShip = new Ship(5);
        expect(() => gameBoard.placeShip(largeShip, [5,6])).toThrow("Ship can't be placed out of the grid")
    })

    test("Place a ship that overlaps", () => {
        const largerShip = new Ship(5);
        const smallShip = new Ship(3);
        expect(() => {
            gameBoard.placeShip(largerShip, [5,4])
            gameBoard.placeShip(smallShip, [5,2])
        }).toThrow("Ship can't be placed: overlapping ship")
    })
})