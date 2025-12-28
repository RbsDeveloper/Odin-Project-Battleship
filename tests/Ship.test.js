test('create a ship with a defined length', () => {
    const ship = new Ship(3);
    expect(ship.length).toBe(3);
})