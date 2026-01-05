export class Ship {
    constructor(length, id) {
        this.length = length;
        this.hits = 0;
        this.id = id;
    }

    hit () {
        this.hits += 1;
    }

    isSunk () {
        return this.hits >= this.length;
    }
}