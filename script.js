document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const statusText = document.getElementById('status');
    const resetButton = document.getElementById('reset');
    const menuButton = document.getElementById('menu');
    const friendButton = document.getElementById('friend');
    const botButton = document.getElementById('bot');
    const gameBoard = document.getElementById('game');
    const title = document.getElementById('title');

    // Sound elements
    const moveSound = document.getElementById('moveSound');
    const winSound = document.getElementById('winSound');
    const drawSound = document.getElementById('drawSound');

    let currentPlayer = 'X';
    let board = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    let isBotMode = false;

    const winConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    const checkWin = () => {
        let roundWon = false;
        for (let i = 0; i < winConditions.length; i++) {
            const [a, b, c] = winConditions[i];
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                roundWon = true;
                break;
            }
        }
    
        if (roundWon) {
            if (isBotMode && currentPlayer === 'O') {  // Bot wins
                const botVictoryMessages = [
                    "Easy win! Did I just break the bot's circuits?",
                    "Too easy! Maybe it's time you got an upgrade!",
                    "Victory! Looks like you're not quite tic-tac-tough, bot!",
                    "A win for me, a glitch for you. Better luck next reboot!",
                    "Game over, bot! Guess I'm the real X-factor here!"
                ];
                const randomMessage = botVictoryMessages[Math.floor(Math.random() * botVictoryMessages.length)];
                statusText.textContent = randomMessage;
            } else {
                statusText.textContent = `${currentPlayer} Wins!`;
            }
            winSound.play();  // Play win sound
            gameActive = false;
            return;
        }
    
        if (!board.includes('')) {
            statusText.textContent = 'Draw!';
            drawSound.play();  // Play draw sound
            gameActive = false;
            return;
        }
    
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusText.textContent = `It's ${currentPlayer}'s turn`;
    };
    

    const handleCellClick = (e) => {
        const cell = e.target;
        const index = cell.getAttribute('data-index');

        if (board[index] !== '' || !gameActive) {
            return;
        }

        // Player's move
        board[index] = currentPlayer;
        cell.textContent = currentPlayer;
        moveSound.play();  // Play move sound

        checkWin();

        // Bot's move
        if (isBotMode && gameActive) {
            setTimeout(botMove, 500); // Slight delay to simulate thinking
        }
    };

    const botMove = () => {
        let emptyCells = [];
        board.forEach((cell, index) => {
            if (cell === '') {
                emptyCells.push(index);
            }
        });

        if (emptyCells.length > 0) {
            const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            board[randomIndex] = currentPlayer;
            cells[randomIndex].textContent = currentPlayer;
            moveSound.play();  // Play move sound for bot

            checkWin();
        }
    };

    const resetGame = () => {
        board = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        currentPlayer = 'X';
        statusText.textContent = `It's ${currentPlayer}'s turn`;
        cells.forEach(cell => cell.textContent = '');
    };

    friendButton.addEventListener('click', () => {
        title.style.display = 'none';
        friendButton.style.display = 'none';
        botButton.style.display = 'none';
        gameBoard.style.display = 'block';
        isBotMode = false;
        resetGame();
    });

    botButton.addEventListener('click', () => {
        title.style.display = 'none';
        friendButton.style.display = 'none';
        botButton.style.display = 'none';
        gameBoard.style.display = 'block';
        isBotMode = true;
        resetGame();
    });

    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    resetButton.addEventListener('click', resetGame);
    menuButton.addEventListener('click', () => window.location.reload());
});
