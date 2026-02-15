export const gameState = {
    players : [],
    mode: null,
    gamePhase: null,
    currentPlayer: 0,
    settings: null,
    activeShip: null,
    shipDirection: "horizontal",
    isProcessingTurn: false,
}

export function getBoards () {

    const boards = gameState.players.map(player => ({
        id : player.id,
        type: player.type,
        grid: player.getBoard().grid.map(row => row.map(cell => ({...cell})))
    }))

    return boards;
}

export function resetEntireGameState () {
    gameState.players = [];
    gameState.mode = null;
    gameState.gamePhase = null;
    gameState.currentPlayer = 0;
    gameState.settings = null;
    gameState.activeShip = null;
    gameState.shipDirection= "horizontal";
    gameState.isProcessingTurn = false;
}

export function resetGameStateForReplay () {
    gameState.players = [];
    gameState.currentPlayer = 0;
    gameState.activeShip = null;
    gameState.shipDirection = 'horizontal';
    gameState.isProcessingTurn = false;
}

