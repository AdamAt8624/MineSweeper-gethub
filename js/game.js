var gBoard;
var size = 0;
var classNAME = [];
var flagesONbombs = [];

var bombPositions = [];

function onInit() {
  size = 4;
  gBoard = buildBoard(size);
}

function buildBoard(size) {
  size = size;
  const board = [];

  for (var i = 0; i < size; i++) {
    board.push([]);

    for (var j = 0; j < size; j++) {
      board[i][j] = "";
    }
  }
  setMinesNegsCount(board);

  renderBoard(board);

  return board;
}
function getRndomARR(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function setMinesNegsCount(board) {
  var bomb = 0;
  var bombsPlaced = 0;

  if (board.length === 4) bomb = 2;
  if (board.length === 8) bomb = 14;
  if (board.length === 12) bomb = 32;
  bombPositions = [];
  while (bombsPlaced < bomb) {
    const i = getRndomARR(0, board.length - 1);
    const j = getRndomARR(0, board[0].length - 1);
    if (!bombPositions.some((pos) => pos.i === i && pos.j === j)) {
      bombPositions.push({ i, j });
      bombsPlaced++;
    }
  }

  console.log("Bomb positions:", bombPositions);

  bombPositions.forEach((pos) => {
    board[pos.i][pos.j] = "💣";
  });
  return bombPositions;
}

function renderBoard(board) {
  var strHTML = "";
  for (var i = 0; i < board.length; i++) {
    strHTML += "<tr>";
    for (var j = 0; j < board[i].length; j++) {
      const cell = board[i][j];
      const className = `cell cell-${i}-${j}`;
      strHTML += `<td class="${className}" onclick="onCellClicked(this, ${i}, ${j},${board.length})" oncontextmenu="onCellMarked(event, this, ${i}, ${j},${board.length}); return false;">${cell}</td>`;
    }
    strHTML += "</tr>";
  }
  const elContainer = document.querySelector(".board");
  elContainer.innerHTML = strHTML;
}

function onCellClicked(elCell, i, j, board) {
  console.log("Clicked cell:", elCell.innerText, "at position:", i, j, board);
}
function onCellMarked(event, elCell, i, j, board) {
  event.preventDefault();
  var boardI = i;
  var boardJ = j;
  if (elCell.innerText === "" || elCell.innerText === "💣") {
    elCell.innerText = "🚩";
  } else if (elCell.innerText === "🚩") {
    elCell.innerText = "";
  }

  for (let i = 0; i < bombPositions.length; i++) {
    if (
      bombPositions[i].i == boardI &&
      bombPositions[i].j == boardJ &&
      elCell != "💣"
    ) {
      console.log("cc:");
    }
  }
}
