import { HTMLTableCellElement, HTMLElement } from 'dom'
//Game State Data
// We needs
//https://boardgames.stackexchange.com/questions/57983/how-to-name-checkers-moves


const board: (number | null)[] = [
    null, 0, null, 1, null, 2, null, 3,
    4, null, 5, null, 6, null, 7, null,
    null, 8, null, 9, null, 10, null, 11,
    null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null,
    12, null, 13, null, 14, null, 15, null,
    null, 16, null, 17, null, 18, null, 19,
    20, null, 21, null, 22, null, 23, null
]


//array.prototype.indexof https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
// This funtion find where the piece is located on the board 
// cached data
//return the first index

function findpiece(pieceId: number): number {
    let parsed = parseInt(pieceId.toString());
    return board.indexOf(parsed);
};
//DOM REFERENCES
//Documentation from:
//https://www.w3schools.com/jsref/dom_obj_var.asp
//https://www.w3schools.com/jsref/met_document_queryselector.asp

const cells: NodeListOf<HTMLTableCellElement> = document.querySelectorAll("td");
let redPieces: NodeListOf<HTMLParagraphElement> = document.querySelectorAll("p");
let blackPieces: NodeListOf<HTMLSpanElement> = document.querySelectorAll("span")
const redTurnText: NodeListOf<HTMLElement> = document.querySelectorAll(".redTurn");
const blackTurnText: NodeListOf<HTMLElement> = document.querySelectorAll(".blackTurn");

//By providing type annotations, you can leverage the benefits of TypeScript's static typing and catch potential type-related errors during development.

//player properties

let turn: boolean = true; //current player turn
let redPieceScore: number = 12;
let blackPieceScore: number = 12;
let playerPieces: HTMLElement[] | NodeListOf<HTMLParagraphElement> | NodeListOf<HTMLSpanElement>;


//with the board array I needed a variable  that hold the piece's properties  
let selectedPiece: {
    pieceId: number,
    indexPiece: number,
    isKing: boolean,
    seventhSpace: boolean,
    ninthSpace: boolean,
    fourteenthSpace: boolean,
    eightteenthSpace: boolean,
    negativeSeventhSpace: boolean,
    negativeNinthSpace: boolean,
    negativefourteenthSpace: boolean,
    negativeeighteenthSpace: boolean
} = {
    pieceId: -1,
    indexPiece: -1,
    isKing: false,
    seventhSpace: false,
    ninthSpace: false,
    fourteenthSpace: false,
    eightteenthSpace: false,
    negativeSeventhSpace: false,
    negativeNinthSpace: false,
    negativefourteenthSpace: false,
    negativeeighteenthSpace: false
}

// Every time that the page loads is gonna show the message StartGame 
function startgame(): void {
    alert("Hey, welcome to checkers!. This game is my new Model Project, i hope you can enjoy this classic. Note: You can review the whole experience & how the game is building in my GitHub Account -- https://github.com/JAMES-CERO -- ")
}
startgame()


// Add an event listener to each piece
function piecesEvent(): void {
    if (turn) {
        for (let i = 0; i < redPieces.length; i++) {
            redPieces[i].addEventListener('click', getPiecescount);
        }
    } else {
        for (let i = 0; i < blackPieces.length; i++) {
            blackPieces[i].addEventListener('click', getPiecescount);
        }
    }
}

// function that removes Onclick on pieces, src https://forum.boardgamearena.com/viewtopic.php?t=17885&start=10
// Element.removeAttribute() from https://developer.mozilla.org/en-US/docs/Web/API/Element/removeAttribute

function removeOnClick(): void {
    for (let i = 0; i < cells.length; i++) {
        cells[i].removeAttribute("onclick");
    }
}


//This is a funtion that hold the pieces count 

function getPiecescount(): void {
    let playerPieces: HTMLElement[];

    if (turn) {
        playerPieces = Array.from(redPieces); // line 14
    } else {
        playerPieces = Array.from(blackPieces);// line 15
    }
    removeOnClick();
    changeColorPiece(playerPieces);
}



// we change the color of the piece that is choose & after thatr turn the piece  back to a normal piece 

function changeColorPiece(playerPieces: HTMLElement[]): void {
    for (let i = 0; i < playerPieces.length; i++) {
        playerPieces[i].style.border = "2px solid white";
    }
    resetPieceProperties();
    const selectedPieceId = playerPieces[0].id; // Assuming the first element represents the selected piece
    const indexPiece = findpiece(parseInt(selectedPieceId, 10));
    getSelectedPiece(selectedPieceId, indexPiece);
}
// resset all the properties this is importante because this has to happen every cell click
// we have all the possibles moves 
function resetPieceProperties(): void {
    selectedPiece.pieceId = -1;
    selectedPiece.indexPiece = -1;
    selectedPiece.isKing = false;
    selectedPiece.seventhSpace = false;
    selectedPiece.ninthSpace = false;
    selectedPiece.fourteenthSpace = false;
    selectedPiece.eightteenthSpace = false;
    selectedPiece.negativeSeventhSpace = false;
    selectedPiece.negativeNinthSpace = false;
    selectedPiece.negativefourteenthSpace = false;
    selectedPiece.negativeeighteenthSpace = false;
}



// parseInt from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt its gona make us return an integer (numbers)
//event.target from https://stackoverflow.com/questions/57489670/type-of-event-target-value-should-be-changed-to-integer-in-react

// this function gets the id piece & the cell of the index board ; the event.target return a string , we need to make it a number 

function getSelectedPiece(pieceId: string, indexPiece: number): void {
    selectedPiece.pieceId = parseInt(pieceId, 10);
    selectedPiece.indexPiece = indexPiece;
    ifPieceIsKing();
}

// element. classlist.contains  from https://developer.mozilla.org/en-US/docs/Web/API/Element/classList

function ifPieceIsKing(): void {
    const selectedPieceElement = document.getElementById(String(selectedPiece.pieceId));
    if (selectedPieceElement && selectedPieceElement.classList.contains("king")) {
        selectedPiece.isKing = true;
    } else {
        selectedPiece.isKing = false;
    }
    getEmptySpaces();
}

// VALIDATED LEGAL MOVES & empty spaces 
// possibles moves 
// how to manipulate table cells from https://stackoverflow.com/questions/8508262/how-to-select-td-of-the-table-with-javascript

function getEmptySpaces(): void {
    if (board[selectedPiece.indexPiece + 7] === null &&
        cells[selectedPiece.indexPiece + 7].classList.contains("noPieceHere") !== true) {
        selectedPiece.seventhSpace = true;
    }
    if (board[selectedPiece.indexPiece + 9] === null &&
        cells[selectedPiece.indexPiece + 9].classList.contains("noPieceHere") !== true) {
        selectedPiece.ninthSpace = true;
    }
    if (board[selectedPiece.indexPiece - 7] === null &&
        cells[selectedPiece.indexPiece - 7].classList.contains("noPieceHere") !== true) {
        selectedPiece.negativeSeventhSpace = true;
    }
    if (board[selectedPiece.indexPiece - 9] === null &&
        cells[selectedPiece.indexPiece - 9].classList.contains("noPieceHere") !== true) {
        selectedPiece.negativeNinthSpace = true;
    }
    getJumpSpaces();
}

function getJumpSpaces(): void {
    if (turn) {
        if (
            board[selectedPiece.indexPiece + 14] === null &&
            cells[selectedPiece.indexPiece + 14]?.classList.contains("noPieceHere") !== true &&
            board[selectedPiece.indexPiece + 7] !== null &&
            typeof board[selectedPiece.indexPiece + 7] === 'number' &&
            board[selectedPiece.indexPiece + 7]! >= 12
        ) {
            selectedPiece.fourteenthSpace = true;
        }
        if (
            board[selectedPiece.indexPiece + 18] === null &&
            cells[selectedPiece.indexPiece + 18]?.classList.contains("noPieceHere") !== true &&
            board[selectedPiece.indexPiece + 9] !== null &&
            typeof board[selectedPiece.indexPiece + 9] === 'number' &&
            board[selectedPiece.indexPiece + 9]! >= 12
        ) {
            selectedPiece.eightteenthSpace = true;
        }
        if (
            board[selectedPiece.indexPiece - 14] === null &&
            cells[selectedPiece.indexPiece - 14]?.classList.contains("noPieceHere") !== true &&
            board[selectedPiece.indexPiece - 7] !== null &&
            typeof board[selectedPiece.indexPiece - 7] === 'number' &&
            board[selectedPiece.indexPiece - 7]! >= 12
        ) {
            selectedPiece.negativefourteenthSpace = true;
        }
        if (
            board[selectedPiece.indexPiece - 18] === null &&
            cells[selectedPiece.indexPiece - 18]?.classList.contains("noPieceHere") !== true &&
            board[selectedPiece.indexPiece - 9] !== null &&
            typeof board[selectedPiece.indexPiece - 9] === 'number' &&
            board[selectedPiece.indexPiece - 9]! >= 12
        ) {
            selectedPiece.negativeeighteenthSpace = true;
        }
    } else {
        if (
            board[selectedPiece.indexPiece + 14] === null &&
            cells[selectedPiece.indexPiece + 14]?.classList.contains("noPieceHere") !== true &&
            board[selectedPiece.indexPiece + 7] !== null &&
            typeof board[selectedPiece.indexPiece + 7] === 'number'
        ) {
            selectedPiece.fourteenthSpace = true;
        }
        if (
            board[selectedPiece.indexPiece + 18] === null &&
            cells[selectedPiece.indexPiece + 18]?.classList.contains("noPieceHere") !== true &&
            board[selectedPiece.indexPiece + 9] !== null &&
            typeof board[selectedPiece.indexPiece + 9] === 'number'
        ) {
            selectedPiece.eightteenthSpace = true;
        }
        if (
            board[selectedPiece.indexPiece - 14] === null &&
            cells[selectedPiece.indexPiece - 14]?.classList.contains("noPieceHere") !== true &&
            board[selectedPiece.indexPiece - 7] !== null &&
            typeof board[selectedPiece.indexPiece - 7] === 'number'
        ) {
            selectedPiece.negativefourteenthSpace = true;
        }
        if (
            board[selectedPiece.indexPiece - 18] === null &&
            cells[selectedPiece.indexPiece - 18]?.classList.contains("noPieceHere") !== true &&
            board[selectedPiece.indexPiece - 9] !== null &&
            typeof board[selectedPiece.indexPiece - 9] === 'number'
        ) {
            selectedPiece.negativeeighteenthSpace = true;
        }
    }
    kingMovesRestrictions();
}






// erase restricts movement if the piece is a king so this piece can go back n forth

function kingMovesRestrictions(): void {
    if (selectedPiece.isKing) {
        choosePieceBorder();
    } else {
        if (turn) {
            selectedPiece.negativeSeventhSpace = false;
            selectedPiece.negativeNinthSpace = false;
            selectedPiece.negativefourteenthSpace = false;
            selectedPiece.negativeeighteenthSpace = false;
        } else {
            selectedPiece.seventhSpace = false;
            selectedPiece.ninthSpace = false;
            selectedPiece.fourteenthSpace = false;
            selectedPiece.eightteenthSpace = false;
        }
        choosePieceBorder();
    }
}
// gives the choose piece a green color when clicks 

function choosePieceBorder(): void {
    if (
        selectedPiece.seventhSpace ||
        selectedPiece.ninthSpace ||
        selectedPiece.fourteenthSpace ||
        selectedPiece.eightteenthSpace ||
        selectedPiece.negativeSeventhSpace ||
        selectedPiece.negativeNinthSpace ||
        selectedPiece.negativefourteenthSpace ||
        selectedPiece.negativeeighteenthSpace
    ) {
        const selectedPieceElement = document.getElementById(String(selectedPiece.pieceId));
        if (selectedPieceElement) {
            selectedPieceElement.style.border = "3px solid green";
            onClickCells();
        }
    } else {
        return;
    }
}



// onClick event from https://www.w3schools.com/tags/att_onclick.asp
//  on clcik vs add event listener https://stackoverflow.com/questions/6348494/addeventlistener-vs-onclick
//note : using anonymous function so we can remove it after , not a good idea use event listener cuz are unremovables 

function onClickCells(): void {
    if (selectedPiece.seventhSpace) {
        cells[selectedPiece.indexPiece + 7].setAttribute("onclick", "makeAMove(7)");
    }
    if (selectedPiece.ninthSpace) {
        cells[selectedPiece.indexPiece + 9].setAttribute("onclick", "makeAMove(9)");
    }
    if (selectedPiece.fourteenthSpace) {
        cells[selectedPiece.indexPiece + 14].setAttribute("onclick", "makeAMove(14)");
    }
    if (selectedPiece.eightteenthSpace) {
        cells[selectedPiece.indexPiece + 18].setAttribute("onclick", "makeAMove(18)");
    }
    if (selectedPiece.negativeSeventhSpace) {
        cells[selectedPiece.indexPiece - 7].setAttribute("onclick", "makeAMove(-7)");
    }
    if (selectedPiece.negativeNinthSpace) {
        cells[selectedPiece.indexPiece - 9].setAttribute("onclick", "makeAMove(-9)");
    }
    if (selectedPiece.negativefourteenthSpace) {
        cells[selectedPiece.indexPiece - 14].setAttribute("onclick", "makeAMove(-14)");
    }
    if (selectedPiece.negativeeighteenthSpace) {
        cells[selectedPiece.indexPiece - 18].setAttribute("onclick", "makeAMove(-18)");
    }
}
// TO DO : MOVEMENT OF  PIECES  - DONE
//this funciton will take a numbr as an argument 
// the number of cells the piece will move

function makeAMove(number: number, removePiece: number): number {
    if (removePiece) {
        const selectedPieceElement = document.getElementById(String(selectedPiece.pieceId));
        if (selectedPieceElement) {
            selectedPieceElement.remove();
        }
    }

    cells[selectedPiece.indexPiece].innerHTML = "";

    if (turn) {
        if (selectedPiece.isKing) {
            cells[selectedPiece.indexPiece + number].innerHTML = `<p class="red-piece king" id="${selectedPiece.pieceId}"></p>`;
            redPieces = document.querySelectorAll("p");
        } else {
            cells[selectedPiece.indexPiece + number].innerHTML = `<p class="red-piece" id="${selectedPiece.pieceId}"></p>`;
            redPieces = document.querySelectorAll("p");
        }
    } else {
        if (selectedPiece.isKing) {
            cells[selectedPiece.indexPiece + number].innerHTML = `<span class="black-piece king" id="${selectedPiece.pieceId}"></span>`;
            blackPieces = document.querySelectorAll("span");
        } else {
            cells[selectedPiece.indexPiece + number].innerHTML = `<span class="black-piece" id="${selectedPiece.pieceId}"></span>`;
            blackPieces = document.querySelectorAll("span");
        }
    }

    let boardPiece: number = selectedPiece.indexPiece;

    if (number === 14 || number === -14 || number === 18 || number === -18) {
        changeTheData(boardPiece, boardPiece + number, boardPiece + (number / 2));
    } else {
        changeTheData(boardPiece, boardPiece + number, removePiece);
    }

    return selectedPiece.indexPiece + number;
}

//this function change the board data on the back end 
// the parameter are the position , the new posititon & also the removepiece that got jumped
function changeTheData(indexPiece: number, newIndex: number, removePiece: number): void {
    board[indexPiece] = null;
    board[newIndex] = String(selectedPiece.pieceId);  //change the original position of the selected piece to null & move the data to the new position
    if (turn && selectedPiece.pieceId < 12 && newIndex >= 57) {  // 57 is the first cell of the last row . 12 is the last number of pieces 
        document.getElementById(selectedPiece.pieceId.toString())?.classList.add("king")
    }
    if (turn === false && selectedPiece.pieceId >= 12 && newIndex <= 7) { // 7 is the las cell in the first row this works for the black pieces 
        document.getElementById(selectedPiece.pieceId.toString())?.classList.add("king")
    }
    //if the position of the piece is >=51 (last row) then the iece become a king the same with the blacks using <+7
    // if a piece s removed change the data to null &  remove a point to the team score   
    if (removePiece) {
        board[removePiece] = null;
        if (turn && selectedPiece.pieceId < 12) {
            cells[removePiece].innerHTML = "";
            blackPieceScore--
        }
        if (turn === false && selectedPiece.pieceId >= 12) {
            cells[removePiece].innerHTML = ""
            redPieceScore--
        }
    }
    resetPieceProperties(); //line 113
    removeOnClick(); // line 82
    piecesEventRemove(); // line 350
}

// remove an event listener to each piece , NOTE: in my plain english code , this was after the piecesEvent /lina 66 , but i though it was better so my code woouldnt be confused with the function remmove "Onclick" / ine 81
function piecesEventRemove(): void {
    if (turn) {
        for (let i = 0; i < redPieces.length; i++) {
            redPieces[i].removeEventListener("click", getPiecescount);
        }
    } else {
        for (let i = 0; i < blackPieces.length; i++) {
            blackPieces[i].removeEventListener("click", getPiecescount);
        }
    }
    winGame();
}
// if the score  hit the 0 then show other team name as winner 
// https://www.w3schools.com/jsref/met_win_alert.asp
function winGame(): void {
    if (blackPieceScore === 0) {
        alert('BlacksWins');


    } else if (redPieceScore === 0) {
        alert('RedWins');
    }
    switchPlayer();
}


//Switch players 
// tthis function would show whos turn is, itiration of each letter changing the size & color
function switchPlayer(): void {
    if (turn) {
        turn = false;
        for (let i = 0; i < redTurnText.length; i++) {
            redTurnText[i].style.color = "lightGrey";
            blackTurnText[i].style.color = "black";
            blackTurnText[i].style = "font-size: 40px";
            redTurnText[i].style = "font-size: 20px";
        }
    } else {
        turn = true;
        for (let i = 0; i < blackTurnText.length; i++) {
            blackTurnText[i].style.color = "lightGrey";
            redTurnText[i].style.color = "black";
            redTurnText[i].style = "font-size: 40px";
            blackTurnText[i].style = "font-size: 20px";
        }
    }
    piecesEvent();
}



piecesEvent();
//     if(turn){
//         turn = false;
//         alert("blacks turn");
//     }else{
//         alert("reds turn");
//     }
//      piecesEvent();
//   }
//   piecesEvent();


// note : if else stataement so it can show an alert when switch the turn (recommended by the teacher), however, it was annying so i just made  the itiration so it can show wih turn is it 
