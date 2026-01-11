import { Gameboard } from "../src/Gameboard.js";
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
            row.forEach(cell => expect(cell.shipReference).toBeNull())
        })
    })
})

describe("Placing ships", () => {
    test("Placing 1 lengthed ship", () => {
        gameBoard.placeShip(gameBoard.fleet[0], "horizontal", [4,4])
        expect(gameBoard.grid[4][4]).toEqual({
            hasShip: true,
            shipReference: gameBoard.fleet[0],
            isHit: false,
        })
    })

    test("Placing a ship with a larger length", () => {
        gameBoard.placeShip(gameBoard.fleet[3], "horizontal", [5,5]);
        expect(gameBoard.grid[5][5]).toEqual({
            hasShip: true,
            shipReference: gameBoard.fleet[3],
            isHit: false
        })
        expect(gameBoard.grid[5][6]).toEqual({
            hasShip: true,
            shipReference: gameBoard.fleet[3],
            isHit: false
        })
        expect(gameBoard.grid[5][7]).toEqual({
            hasShip: true,
            shipReference: gameBoard.fleet[3],
            isHit: false
        })
    })

    test("Place a ship that go outside the board", () => {
        expect(() => gameBoard.placeShip(gameBoard.fleet[0], "horizontal", [5,6])).toThrow("Ship can't be placed out of the grid")
    })

    test("Place a ship that overlaps", () => {
        expect(() => {
            gameBoard.placeShip(gameBoard.fleet[0], "horizontal", [5,4])
            gameBoard.placeShip(gameBoard.fleet[2], "horizontal", [5,2])
        }).toThrow("Ship can't be placed: overlapping ship")
    })

    test("Choose a direction for the ship placement", () => {
        gameBoard.placeShip(gameBoard.fleet[3], "vertical", [0,3]);
        expect(gameBoard.grid[0][3]).toEqual({
            hasShip: true,
            shipReference: gameBoard.fleet[3],
            isHit: false
        });
        expect(gameBoard.grid[1][3]).toEqual({
            hasShip: true,
            shipReference: gameBoard.fleet[3],
            isHit: false
        });
        expect(gameBoard.grid[2][3]).toEqual({
            hasShip: true,
            shipReference: gameBoard.fleet[3],
            isHit: false
        })
    })
})

describe("Receiving an attack", () => {
    test("Taking a pair of coordinates and check them", () => {
        gameBoard.placeShip(gameBoard.fleet[1], 'horizontal', [3,3])
        expect(gameBoard.receiveAttack([3,4])).toBe(true)
    })

    test("Taking a pair of coordinates and call hit on the ship object", () => {
        gameBoard.placeShip(gameBoard.fleet[3], 'horizontal', [3,4]);
        gameBoard.receiveAttack([3,5]);
        expect(gameBoard.fleet[3].hits).toBe(1);
    })

    test("Record coords of missed attacks", () => {
        gameBoard.receiveAttack([3,5])
        gameBoard.receiveAttack([4,5])
        gameBoard.receiveAttack([3,7]);
        expect(gameBoard.grid[3][5]).toEqual({
            hasShip: false,
            shipReference: null,
            isHit: true,
        })
        expect(gameBoard.grid[4][5]).toEqual({
            hasShip: false,
            shipReference: null,
            isHit: true,
        })
        expect(gameBoard.grid[3][7]).toEqual({
            hasShip: false,
            shipReference: null,
            isHit: true,
        })
    })

    test("Prevent double counting when the same cell is attacked twice", () => {
        
        gameBoard.placeShip(gameBoard.fleet[1], "horizontal", [3,3]);
        gameBoard.receiveAttack([3,4])
        expect(() => gameBoard.receiveAttack([3,4])).toThrow("Cell allready hit");
        expect(gameBoard.grid[3][4]).toEqual({
            hasShip: true,
            shipReference: gameBoard.fleet[1],
            isHit: true,
        })
    })
})

describe("Report wheather or not all ships have been sunk", () => {
    test("Check if all ships have been sunk", () => {


        gameBoard.placeShip(gameBoard.fleet[0], 'horizontal', [1,1]);
        gameBoard.placeShip(gameBoard.fleet[1], 'horizontal', [2,3]);
        gameBoard.placeShip(gameBoard.fleet[2], 'horizontal', [3,4]);
        gameBoard.placeShip(gameBoard.fleet[3], 'horizontal', [5,1]);
        gameBoard.placeShip(gameBoard.fleet[4], 'horizontal', [6,2]);

        expect(gameBoard.areAllShipSunk()).toBe(false);

        gameBoard.receiveAttack([1,1])
        gameBoard.receiveAttack([1,2])
        gameBoard.receiveAttack([1,3])
        gameBoard.receiveAttack([1,4])
        gameBoard.receiveAttack([1,5])
        gameBoard.receiveAttack([2,3])
        gameBoard.receiveAttack([2,4])
        gameBoard.receiveAttack([2,5])
        gameBoard.receiveAttack([2,6])
        gameBoard.receiveAttack([3,4])
        gameBoard.receiveAttack([3,5])
        gameBoard.receiveAttack([3,6])
        gameBoard.receiveAttack([5,1])
        gameBoard.receiveAttack([5,2])
        gameBoard.receiveAttack([5,3])
        gameBoard.receiveAttack([6,2])
        gameBoard.receiveAttack([6,3])

        console.log(gameBoard.fleet[0])

        expect(gameBoard.areAllShipSunk()).toBe(true);
    })
})