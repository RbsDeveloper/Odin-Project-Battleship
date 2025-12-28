
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