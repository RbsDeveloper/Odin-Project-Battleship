import { Ship } from "../src/Ship.js";

let ship;

beforeEach(()=> {
    ship = new Ship(3)
})

test('Create a ship with a defined length', () => {
    expect(ship.length).toBe(3);
})

test("Test if ship can get hit", () => {
    ship.hit();
    expect(ship.hits).toBe(1);
})

test("Test if ship can sunk",  () => {
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
})