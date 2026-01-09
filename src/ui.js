import { getBoards } from "./gameController.js";

const playerBoardsArea = () => {
    const main = document.createElement("main");
    const boardsData = getBoards();
    
    boardsData.forEach(playerGrid => {
        main.append(renderGameboard(playerGrid));
    });
    
    return main
}

const renderGameboard = (grid) => {
    const boardContainer = document.createElement('div');
    boardContainer.classList.add('board')
    boardContainer.dataset.playerId = grid.id;
    
    boardContainer.addEventListener('click', (e) => {
        if(!e.target.classList.contains('cell')) return 

        console.log(e.target)
        
        const row = e.target.dataset.row
        const col = e.target.dataset.col
        const playerId = boardContainer.dataset.playerId

        return console.log({row, col, playerId})
    })

    createCells(boardContainer, grid.grid);

    return boardContainer;
}

const createCells = (container, board) => {
    for(let i = 0 ; i < board.length; i++){

        for(let j = 0; j < board[i].length ; j++){
            const cell = document.createElement('div');
            cell.classList.add('cell')
            cell.dataset.row = `${i}`;
            cell.dataset.col = `${j}`

            container.append(cell);
        }

    }
}

export const createLayout = () => {
    const content = document.getElementById("content");

    content.append(playerBoardsArea())
}



