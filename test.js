const cells = Array.from(document.querySelectorAll("[data-cell]"));
const status = document.querySelector("#status");
const resetButton = document.querySelector("#reset");
const scoreXElement = document.querySelector("#score-x");
const scoreOElement = document.querySelector("#score-o");
const winningLines = [
	[0, 1, 2], [3, 4, 5], [6, 7, 8],
	[0, 3, 6], [1, 4, 7], [2, 5, 8],
	[0, 4, 8], [2, 4, 6],
];

let board = Array(9).fill("");
let currentPlayer = "X";
let roundOver = false;
let scoreX = 0;
let scoreO = 0;

function finishRound(message, winningLine = []) {
	roundOver = true;
	status.textContent = message;
	for (const index of winningLine) {
		cells[index].classList.add("winner");
	}
	cells.forEach((cell) => { cell.disabled = true; });
}

function playCell(event) {
	const cell = event.currentTarget;
	const index = Number(cell.dataset.cell);
	if (roundOver || board[index]) return;

	board[index] = currentPlayer;
	cell.textContent = currentPlayer;
	cell.classList.add(currentPlayer.toLowerCase());
	cell.setAttribute("aria-label", `${cell.getAttribute("aria-label").split(",")[0]}, ${currentPlayer}`);

	const winningLine = winningLines.find((line) => line.every((position) => board[position] === currentPlayer));
	if (winningLine) {
		if (currentPlayer === "X") {
			scoreX += 1;
			scoreXElement.textContent = scoreX;
		} else {
			scoreO += 1;
			scoreOElement.textContent = scoreO;
		}
		finishRound(`Player ${currentPlayer} wins!`, winningLine);
		return;
	}

	if (board.every(Boolean)) {
		finishRound("It's a draw. Good game!");
		return;
	}

	currentPlayer = currentPlayer === "X" ? "O" : "X";
	status.textContent = `Player ${currentPlayer}'s turn`;
}

function startNewRound() {
	board = Array(9).fill("");
	currentPlayer = "X";
	roundOver = false;
	status.textContent = "Player X's turn";
	cells.forEach((cell) => {
		cell.textContent = "";
		cell.disabled = false;
		cell.classList.remove("x", "o", "winner");
		cell.setAttribute("aria-label", `${cell.getAttribute("aria-label").split(",")[0]}, empty`);
	});
}

cells.forEach((cell) => cell.addEventListener("click", playCell));
resetButton.addEventListener("click", startNewRound);
