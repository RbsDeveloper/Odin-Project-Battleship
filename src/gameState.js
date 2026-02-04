export const gameState = {
    players : [],
    mode: null,
    gamePhase: null,
    currentPlayer: 0,
    settings: null,
    activeShip: null,
    shipDirection: "horizontal"
}

export function getBoards () {

    const boards = gameState.players.map(player => ({
        id : player.id,
        type: player.type,
        grid: player.getBoard().grid.map(row => row.map(cell => ({...cell})))
    }))

    return boards;
}