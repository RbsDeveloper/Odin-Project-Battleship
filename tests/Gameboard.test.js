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
            row.forEach(cell => expect(cell.shipReference).toBeNull())
        })
    })
})

describe("Placing ships", () => {
    test("Placing 1 lengthed ship", () => {
        const firstShip = new Ship(1);
        gameBoard.placeShip(firstShip, "horizontal", [4,4])
        expect(gameBoard.grid[4][4]).toEqual({
            hasShip: true,
            shipReference: firstShip,
            isHit: false,
        })
    })

    test("Placing a ship with a larger length", () => {
        const largerShip = new Ship(3);
        gameBoard.placeShip(largerShip, "horizontal", [5,5]);
        expect(gameBoard.grid[5][5]).toEqual({
            hasShip: true,
            shipReference: largerShip,
            isHit: false
        })
        expect(gameBoard.grid[5][6]).toEqual({
            hasShip: true,
            shipReference: largerShip,
            isHit: false
        })
        expect(gameBoard.grid[5][7]).toEqual({
            hasShip: true,
            shipReference: largerShip,
            isHit: false
        })
    })

    test("Place a ship that go outside the board", () => {
        const largeShip = new Ship(5);
        expect(() => gameBoard.placeShip(largeShip, "horizontal", [5,6])).toThrow("Ship can't be placed out of the grid")
    })

    test("Place a ship that overlaps", () => {
        const largerShip = new Ship(5);
        const smallShip = new Ship(3);
        expect(() => {
            gameBoard.placeShip(largerShip, "horizontal", [5,4])
            gameBoard.placeShip(smallShip, "horizontal", [5,2])
        }).toThrow("Ship can't be placed: overlapping ship")
    })

    test("Choose a direction for the ship placement", () => {
        const verticalShip = new Ship(3);
        gameBoard.placeShip(verticalShip, "vertical", [0,3]);
        expect(gameBoard.grid[0][3]).toEqual({
            hasShip: true,
            shipReference: verticalShip,
            isHit: false
        });
        expect(gameBoard.grid[1][3]).toEqual({
            hasShip: true,
            shipReference: verticalShip,
            isHit: false
        });
        expect(gameBoard.grid[2][3]).toEqual({
            hasShip: true,
            shipReference: verticalShip,
            isHit: false
        })
    })
})

describe("Receiving an attack", () => {
    test("Taking a pair of coordinates and check them", () => {
        const ship = new Ship(3);
        gameBoard.placeShip(ship, 'horizontal', [3,3])
        expect(gameBoard.receiveAttack([3,4])).toBe(true)
    })

    test("Taking a pair of coordinates and call hit on the ship object", () => {
        const ship = new Ship(4);
        gameBoard.placeShip(ship, 'horizontal', [3,4]);
        gameBoard.receiveAttack([3,5]);
        expect(ship.hits).toBe(1);
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
        const ship = new Ship(4);
        gameBoard.placeShip(ship, "horizontal", [3,3]);
        gameBoard.receiveAttack([3,4])
        expect(() => gameBoard.receiveAttack([3,4])).toThrow("Cell allready hit");
        expect(gameBoard.grid[3][4]).toEqual({
            hasShip: true,
            shipReference: ship,
            isHit: true,
        })
    })
})

describe("Report wheather or not all ships have been sunk", () => {
    test("Check if all ships have been sunk", () => {
        const firstShip = new Ship(1);
        const secondShip = new Ship(1);
        const thirdShip = new Ship(1);
        const forthShip = new Ship(1);
        const fifthShip = new Ship(1);

        gameBoard.placeShip(firstShip, 'horizontal', [1,1]);
        gameBoard.placeShip(secondShip, 'horizontal', [1,3]);
        gameBoard.placeShip(thirdShip, 'horizontal', [2,4]);
        gameBoard.placeShip(forthShip, 'horizontal', [5,1]);
        gameBoard.placeShip(fifthShip, 'horizontal', [6,2]);

        expect(gameBoard.areAllShipSunk(gameBoard.shipStore)).toBe(false);

        gameBoard.receiveAttack([1,1])
        gameBoard.receiveAttack([1,3])
        gameBoard.receiveAttack([2,4])
        gameBoard.receiveAttack([5,1])
        gameBoard.receiveAttack([6,2])

        expect(gameBoard.areAllShipSunk(gameBoard.shipStore)).toBe(true);
    })
})