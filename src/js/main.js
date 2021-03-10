function init() {
    createField(5)
}

window.addEventListener("load", init);

let data = {
    gameField:[],
    turn:1,
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
    console.log("updating field");
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
            let cell = row[cellIdx];
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
        flipTurn();
        updateFieldContents()
    }
}

function updateFieldContents() {
    for (let rowIdx in data.gameField){
        let row = data.gameField[rowIdx];
        for (let cellIdx in row) {
            let cell = row[cellIdx];
            if (cell.content === 0 && !document.getElementById(`img-${cellIdx}-${rowIdx}`)){

                let cellHTML = document.getElementById(`${cellIdx}-${rowIdx}`);
                cellHTML.innerHTML="";

                let img = document.createElement("img");
                img.src = "img/green_circle.png";
                img.alt = "O";
                img.id = `img-${cellIdx}-${rowIdx}`;
                cellHTML.appendChild(img);

            } else {

                if (cell.content===1 && !document.getElementById(`img-${cellIdx}-${rowIdx}`)) {

                    let cellHTML = document.getElementById(`${cellIdx}-${rowIdx}`);
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
