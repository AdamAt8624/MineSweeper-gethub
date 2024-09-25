var gBoard = [];
var size = 0;
var flagsARR = [];
var interval;
var seconds = 0;
var gameStarted = false;
var bombPositions = [];
var flagnum = 0;
var cklickCOUNT = 0;
var gameOver = false

function onInit() {
  size = 4
  gBoard = buildBoard(size)
}

function buildBoard(size) {
  cklickCOUNT = 0
  size = size
  flagsARR = []
  const board = []

  for (var i = 0; i < size; i++) {
    board.push([]);

    for (var j = 0; j < size; j++) {
      board[i][j] = ""
    }
  }
  
  flagleft(board);
  gBoard = board;
  renderBoard(gBoard);
  neighbors(gBoard);

  return board;
}
function getRndomARR(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

//bullding bobms array
function setMinesNegsCount(gBoard) {
  var bomb = (gBoard.length === 4) ? 2 : (gBoard.length === 8) ? 14 : 32;
  flagnum = bomb;

  bombPositions = [];
  while (bombPositions.length < bomb) {
    const i = getRndomARR(0, gBoard.length - 1);
    const j = getRndomARR(0, gBoard[0].length - 1);
    if (!bombPositions.some(pos => pos.i === i && pos.j === j)) {
      bombPositions.push({ i, j });
    }
  }
  console.log('bombPositions:', bombPositions)
  neighbors(gBoard)
}

function renderBoard(board) {
  var strHTML = ""
  for (var i = 0; i < board.length; i++) {
    strHTML += "<tr>"
    for (var j = 0; j < board[i].length; j++) {
      const cell = board[i][j]
      const className = `cell cell-${i}-${j}`

      strHTML += `<td class="${className}" onclick="onCellClicked(this, ${i}, ${j},${board.length})" oncontextmenu="onCellMarked(event, this, ${i}, ${j},${board.length}); return false;">${cell}</td>`
    }
    strHTML += "</tr>"
  }

  const elContainer = document.querySelector(".board")
  elContainer.innerHTML = strHTML
}

function onCellClicked(elCell, i, j) {
  if (gameOver) return;

  if (cklickCOUNT === 0) {
    setMinesNegsCount(gBoard)
  } else {
    checkLose(i, j)
  }

  revealCells(i, j)
  if (!gameStarted) {
    startTimer()
    gameStarted = true
  }
  cklickCOUNT++
}

// flag marked
function onCellMarked(event, elCell, i, j, board) {
  var flagcount = document.querySelector(".flagCount")
  event.preventDefault();
  if (elCell.innerHTML != "🚩") {
    flagnum -= 1
    flagcount.innerHTML = flagnum
    flagsARR.push({
      i: i,
      j: j,
      cell: elCell.innerHTML,
    });
    elCell.innerText = "🚩";
  } else if (elCell.innerText == "🚩") {
    for (let g = 0; g < flagsARR.length; g++) {
      if (flagsARR[g].i == i && flagsARR[g].j == j) {
        elCell.innerText = flagsARR[g].cell
        flagsARR.splice(g, 1)
        console.log("i:", g)
      }
    }
    flagnum += 1;
    flagcount.innerHTML = flagnum;
  }
}

//timer
function startTimer() {
  interval = setInterval(() => {
    seconds++;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    document.querySelector(".timer").innerText =
      String(minutes).padStart(2, "0") + ":" + String(secs).padStart(2, "0")
  }, 1000);
}

//number flags in body
function flagleft(board) {
  var flagcount = document.querySelector(".flagCount")
  if (board.length == 4) {
    flagcount.innerHTML = 2
  }
  if (board.length == 8) flagcount.innerHTML = 14
  if (board.length == 12) flagcount.innerHTML = 32
}
function neighbors(board) {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (bombPositions.some(pos => pos.i === i && pos.j === j)) continue

      let count = 0;
      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
          if (x === 0 && y === 0) continue

          const ni = i + x
          const nj = j + y
          if (ni >= 0 && ni < board.length && nj >= 0 && nj < board[i].length) {
            if (bombPositions.some(pos => pos.i === ni && pos.j === nj)) count++
          }
        }
      }
      if (count > 0) board[i][j] = count
    }
  }
}
  function checkLose(i, j) {
    for (let g = 0; g < bombPositions.length; g++) {
      if (i === bombPositions[g].i && j === bombPositions[g].j) {
        gameOver = true
        clearInterval(interval)
        alert("Game Over! You clicked a bomb.")
        return true
      }
    }
    return false
  }

function revealCells(i, j) {
  if (i < 0 || j < 0 || i >= gBoard.length || j >= gBoard[i].length) return
  const cell = document.querySelector(`.cell-${i}-${j}`)
  if (cell.classList.contains('revealed')) return
  if (bombPositions.some(pos => pos.i === i && pos.j === j)) {
    checkLose(i, j)
    return
  }
  cell.classList.add('revealed')

  if (gBoard[i][j] !== "") {
    cell.innerText = gBoard[i][j]
    return
  }

  if (gBoard[i][j] === "") {
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        if (x === 0 && y === 0) continue
        revealCells(i + x, j + y)
      }
    }
  }
}