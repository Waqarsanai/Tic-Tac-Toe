const board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];

const players = ['X', 'O'];
let currentPlayer = 0;

const boardCells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('status');

boardCells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

function handleCellClick(event) {
    const clickedCell = event.target;
    const row = parseInt(clickedCell.getAttribute('data-row'));
    const col = parseInt(clickedCell.getAttribute('data-col'));

    if (board[row][col] === '' && currentPlayer === 0 && !isGameWon()) {
        board[row][col] = players[currentPlayer];
        clickedCell.textContent = players[currentPlayer];
        clickedCell.style.pointerEvents = 'none'; // Disable further clicks on this cell
        currentPlayer = 1 - currentPlayer; // Switch players

        if (isGameWon()) {
            statusDisplay.textContent = `${players[1 - currentPlayer]} wins!`;
        } else if (isBoardFull()) {
            statusDisplay.textContent = "It's a draw!";
        } else {
            statusDisplay.textContent = `Player's turn`;
            setTimeout(computerMove, 500);
        }
    }
}

function computerMove() {
    const bestMove = findBestMove(board);
    const computerCell = boardCells[bestMove.row * 3 + bestMove.col];

    board[bestMove.row][bestMove.col] = players[currentPlayer];
    computerCell.textContent = players[currentPlayer];
    computerCell.style.pointerEvents = 'none'; // Disable further clicks on this cell
    currentPlayer = 1 - currentPlayer; // Switch players

    if (isGameWon()) {
        statusDisplay.textContent = `${players[1 - currentPlayer]} wins!`;
    } else if (isBoardFull()) {
        statusDisplay.textContent = "It's a draw!";
    } else {
        statusDisplay.textContent = `Player's turn`;
    }
}

function findBestMove(board) {
    let bestVal = -Infinity;
    let bestMove = { row: -1, col: -1 };

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === '') {
                board[i][j] = players[currentPlayer];

                const moveVal = minimax(board, 0, false);

                board[i][j] = ''; // Undo the move

                if (moveVal > bestVal) {
                    bestVal = moveVal;
                    bestMove.row = i;
                    bestMove.col = j;
                }
            }
        }
    }

    return bestMove;
}

function minimax(board, depth, isMaximizing) {
    if (isGameWon()) {
        return isMaximizing ? -10 + depth : 10 - depth;
    } else if (isBoardFull()) {
        return 0;
    }

    if (isMaximizing) {
        let bestVal = -Infinity;

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === '') {
                    board[i][j] = players[currentPlayer];
                    bestVal = Math.max(bestVal, minimax(board, depth + 1, !isMaximizing));
                    board[i][j] = ''; // Undo the move
                }
            }
        }

        return bestVal;
    } else {
        let bestVal = Infinity;

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === '') {
                    board[i][j] = players[1 - currentPlayer];
                    bestVal = Math.min(bestVal, minimax(board, depth + 1, !isMaximizing));
                    board[i][j] = ''; // Undo the move
                }
            }
        }

        return bestVal;
    }
}

function isGameWon() {
    // Check rows, columns, and diagonals for a win
    for (let i = 0; i < 3; i++) {
        if (
            (board[i][0] !== '' && board[i][0] === board[i][1] && board[i][0] === board[i][2]) ||
            (board[0][i] !== '' && board[0][i] === board[1][i] && board[0][i] === board[2][i])
        ) {
            return true;
        }
    }
    if (
        (board[0][0] !== '' && board[0][0] === board[1][1] && board[0][0] === board[2][2]) ||
        (board[0][2] !== '' && board[0][2] === board[1][1] && board[0][2] === board[2][0])
    ) {
        return true;
    }
    return false;
}

function isBoardFull() {
    // Check if the board is full
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === '') {
                return false;
            }
        }
    }
    return true;
}

document.getElementById('resetButton').addEventListener('click', resetGame);

function resetGame() {
    // Reset the game state
    board.forEach(row => row.fill(''));
    boardCells.forEach(cell => {
        cell.textContent = '';
        cell.style.pointerEvents = 'auto'; // Re-enable cell clicks
    });
    currentPlayer = 0;
    statusDisplay.textContent = `Player's turn`;
}
