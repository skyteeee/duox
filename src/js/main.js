function init() {
    initGame(5, 4);
}

function getContentCells () {
    let cells = [];
    for (let y in data.gameField) {
        for (let x in data.gameField[y]) {
            if (data.gameField[y][x].content !== null) {
                cells.push({x,y});
            }
        }
    }
    return cells;
}

function hideGameOver () {
    let holder = document.getElementById("gameInfoHolder");
    holder.className = "gameInfoHolder hiding";
    setTimeout(() => {
        holder.className = "gameInfoHolder hidden"
    }, 1300)
}

function showGameOver () {
    document.getElementById("gameInfoHolder").className = "gameInfoHolder";
    let winner = data.score[0] > data.score[1] ? 0 : (data.score[0] < data.score[1] ? 1 : null);
    document.getElementById("winner").innerText = winner === null ? "Draw" : `Winner: ${winner === 0 ? "O" : "X"}`;
    document.getElementById("finalScore").innerText = `Score: ${winner === 1 ? data.score[1] : data.score[0]}`
}

function initGame (fieldSize, toWin) {
    if (data.gameField === null) {
        createField(fieldSize);
    } else {
        clearCells(getContentCells());
        hideGameOver();
    }
    data.toWin = toWin;
    data.fieldSize = fieldSize;
    data.turn = 1;
    data.score = [0,0];
    updateScore();
    setArms();
}

window.addEventListener("load", init);

let data = {
    gameField:null,
    turn:1,
    toWin:3,
    fieldSize:3,
    score:[0,0],
};

function createField(fieldSize) {
    let field = [];
    for (let counter1 = 0; counter1<fieldSize; counter1++){
        let row = [];
        for (let counter2 = 0; counter2<fieldSize; counter2++){
            let cell = {content:null};
            row.push(cell);
        }
        field.push(row);
    }
    data.gameField = field;
    updateField();
}

function updateField() {
    updateFieldHTML();
    updateFieldContents();
}

function updateFieldHTML() {
    let field = document.getElementById("field");
    field.innerHTML="";
    for (let rowIdx in data.gameField){
        let row = data.gameField[rowIdx];
        let rowHTML=document.createElement("div");
        rowHTML.className = "row";
        for (let cellIdx in row) {
            let cellHTML = document.createElement("div");
            cellHTML.className = "cell";
            cellHTML.id = `${cellIdx}-${rowIdx}`;
            cellHTML.onclick = () => {setCellContent(cellIdx, rowIdx)};
            rowHTML.appendChild(cellHTML);
        }
        field.appendChild(rowHTML);
    }
}

function flipTurn() {
    data.turn = (data.turn+1) % 2;
    setArms();
}

function setArms () {
    let rightArm = document.getElementById("rightArm");
    let leftArm = document.getElementById("leftArm");
    if (data.turn===1) {
        leftArm.className = "arm leftArm active";
        rightArm.className = "arm rightArm inactive";
    } else {
        leftArm.className = "arm leftArm inactive";
        rightArm.className = "arm rightArm active";
    }
}

function setCellContent(x, y) {
    if (data.gameField[y][x].content === null) {
        data.gameField[y][x].content = data.turn;
        updateFieldContents();
        let matches = checkForWin(x, y);
        if (matches.length !== 0) {
            clearCells(matches);
            increaseScore(matches.length);
        } else {
            if (isGameOver()) {
                showGameOver();
            }
        }
        flipTurn();
    }
}

function isGameOver () {
    for (let row of data.gameField) {
        for (let cell of row) {
            if (cell.content === null) {
                return false;
            }
        }
    }
    return true;
}

function increaseScore (cellAmount) {
    data.score[data.turn] += cellAmount * 10 + (cellAmount - data.toWin) * 20;
    updateScore();
}

function updateScore () {
    document.getElementById(`score-1`).innerText = data.score[1];
    document.getElementById(`score-0`).innerText = data.score[0];
}

function clearCells(cells) {
    let time = 500;
    for (let cell of cells) {
        setTimeout(() => {
            let img = document.getElementById(`img-${cell.x}-${cell.y}`);
            img.className = "dying";
            setTimeout(() => {
                data.gameField[cell.y][cell.x].content = null;
                updateFieldContents();
            }, 400);
        },
            time);
        time += 100;
    }
}

function checkForWin (x, y) {
    x = parseInt(x, 10);
    y = parseInt(y, 10);
    for (let vector of [{x:1, y:0}, {x:0, y:1}, {x:1, y:1}, {x:-1, y:1}]) {
        let coordinates = [];
        coordinates.push(...countMatches(x, y, vector.x, vector.y));
        coordinates.push({x,y});
        coordinates.push(...countMatches(x, y, -vector.x, -vector.y));
        if (coordinates.length >= data.toWin) {
            return coordinates.sort((a, b) => {
                let xChange = a.x - b.x;
                if (xChange === 0) {
                    return a.y - b.y;
                }
                return xChange;
            });
        }
    }
    return [];
}

function countMatches (startX, startY, xStep, yStep) {
    let coordinates = [];
    let ox = data.gameField[startY][startX].content;
    let x = startX + xStep;
    let y = startY + yStep;
    while (x < data.fieldSize && x >= 0
        && y < data.fieldSize && y >= 0
        && data.gameField[y][x].content === ox) {
        coordinates.push({x, y});
        x += xStep;
        y += yStep;
    }
    return coordinates;
}

function updateFieldContents() {
    for (let rowIdx in data.gameField){
        let row = data.gameField[rowIdx];
        for (let cellIdx in row) {
            let cell = row[cellIdx];
            let imgHTML = document.getElementById(`img-${cellIdx}-${rowIdx}`);
            let cellHTML = document.getElementById(`${cellIdx}-${rowIdx}`);

            if (cell.content === null && imgHTML) {
                cellHTML.innerHTML="";
            }

            if (cell.content === 0 && !imgHTML){
                cellHTML.innerHTML="";
                let img = document.createElement("img");
                img.src = "img/green_circle.png";
                img.alt = "O";
                img.id = `img-${cellIdx}-${rowIdx}`;
                cellHTML.appendChild(img);

            } else {

                if (cell.content===1 && !imgHTML) {
                    cellHTML.innerHTML="";
                    let img = document.createElement("img");
                    img.src = "img/red_cross.png";
                    img.alt = "X";
                    img.id = `img-${cellIdx}-${rowIdx}`;
                    cellHTML.appendChild(img);
                }
            }
        }
    }
}
