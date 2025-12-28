export function Gameboard () {
    let grid = Array(10).fill(null).map(() => Array(10).fill(null));
    return { grid }
}
