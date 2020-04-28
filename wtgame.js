const canvas = document.getElementById('wiretap');
const context = canvas.getContext('2d');

const alarmRed = '#c00'

let myRAF; // myRAF = requestAnimationFrame

let boardTop = document.getElementById('board-top');
let boardBottom = document.getElementById('board-bottom');

let path01 = document.getElementById('path-01');
let path02 = document.getElementById('path-02');

let chipA0 = document.getElementById('chip-A0');
let chipA1 = document.getElementById('chip-A1');
let chipP0 = document.getElementById('chip-P0');
let chipP1 = document.getElementById('chip-P1');

let chip00 = document.getElementById('chip-00');
let chip50 = document.getElementById('chip-50');
let chip01 = document.getElementById('chip-01');
let chip51 = document.getElementById('chip-51');
let chip02 = document.getElementById('chip-02');
let chip52 = document.getElementById('chip-52');
let chip03 = document.getElementById('chip-03');
let chip53 = document.getElementById('chip-53');


let timerInput = 0.1; // time for solving puzzle in min;
let timeSec01 = timerInput * 60 * 10;

function drawDSTimer() {
  let timer = setInterval(myTimer, 100);
  function myTimer() {
    let StrTimer = '00:00:00'
    if (timeSec01 < 0) {
      clearInterval(timer);
      popUpWindow('time-out');
    } else {
      m = Math.trunc(timeSec01/10/60 % 60);
      s = Math.trunc(timeSec01/10 % 60);
      ds = timeSec01%10; 
      strTimer =  (m<10) ? `0${m}`  : `${m}`;
      strTimer += (s<10) ? `:0${s}` : `:${s}`;
      strTimer += `:${ds}0`;
      --timeSec01;
      context.fillStyle = '#000';
      if ((s < 10) && (s % 2 != 0)) {
        context.fillStyle = '#b00'
      };
      context.fillRect(1010, 760, 205, 50);
      context.font = "36px Consolas";
      context.fillStyle = '#0f0';
      context.textAlign = "start";
      context.fillText("" + strTimer, 1030, 796);
    }
  }
}

function createChipSet(w, h) {
  const matrix = [];
  for (let i = 0; i < h; i++) {
    matrix[i] = []
    for (let j = 0; j < w; j++) {
        matrix[i][j] = 10*i + j;
        console.log(matrix[i][j])
    }
  }
  return matrix;
}

function drawBoard() {
//  context.fillStyle = "#001";
//  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(boardTop, 0, 0);
  context.drawImage(boardBottom, 0, 707);
}

function drawTiles() {

  for (j = 0; j < 5; j++) {
    for (i = 1; i < 14; i += 2) {
      context.drawImage(chip01, 10+(32*3) + 64 * i, (2*32) + (j*64*2) + 2);
      if (i < 12) {context.drawImage(path02, 10+(32*3) + 64 * (i+1), (2*33) + (j*64*2))};
    }
  }

  context.drawImage(chip52, 10+(32*3) + 7*64, (2*32) + (2*64*2) + 2);  // BLUE CHIP

  context.drawImage(chip02, 8+(32*19)+3, 748);  // BOTTOM board CHIP

  context.drawImage(chipA0, 10+(32*3) + 64 * 15, (1*32) + 2);  // ALARM CHIP
  context.drawImage(chipA1, 10+(32*3) + 64 * 15, (5*32) + 2);  // ALARM CHIP

  context.drawImage(chipP0, 10+(32*3) + 33*32, (3*32) + 2);  // PHONE CHIP
  context.drawImage(chipP1, 10+(32*3) + 33*32, (7*32) + 2);  // PHONE CHIP

}

function moveBlueChip() {
}
// - - - - - - - - -- - -- ----------------------------- //
function loading(message) {
  context.fillStyle = "#001";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = '#ffd';
  context.fillRect(440, 250, 400, 200);
  context.font = "36px Arial";
  context.fillStyle = '#100';
  context.textAlign = "center";
  context.fillText(message, 640, 310);
}
function pauseBrowser(millis) {
  var date = Date.now();
  var curDate = null;
  do {
      curDate = Date.now();
  } while (curDate-date < millis);
}
function popUpWindow(type) {
  if (type == 'alarm') {
    context.fillStyle = '#c00';
    context.fillRect(440, 250, 400, 200);
    context.font = "64px Arial";
    context.fillStyle = '#ff0';
    context.textAlign = "center";
    context.fillText("!!! ALARM !!!", 640, 370);
  } else if (type == 'clue') {
    context.fillStyle = '#005';
    context.fillRect(440, 250, 400, 200);
    context.font = "64px Arial";
    context.fillStyle = '#fff';
    context.textAlign = "center";
    context.fillText("--- CLUE! ---", 640, 370);
  } else if (type == 'time-out') {
    context.fillStyle = '#ffd';
    context.fillRect(440, 250, 400, 200);
    context.font = "36px Arial";
    context.fillStyle = '#100';
    context.textAlign = "center";
    context.fillText("Time expired.", 640, 310);
    context.fillText("0 phones tapped", 640, 360);
    context.fillText("0 alarms", 640, 410);
  }
}
// - - -- -- - - - -- - - -  - - - - - - - -- -  --     //

function draw() {
  drawTiles();
}

function update() {
  draw();
  myRAF = requestAnimationFrame(update);
}

const chipSet = createChipSet(7, 5); // Create Initial Chip Set 

    const freeChip = 001;

//    const pathSet = createMatrix(6, 9); // Created empty matrix for chip state

    const signal = {a: 1, b: 0};

const player = {
  pos: {x: 4, y: 3},
};

document.addEventListener('keydown', event => {
  if (event.keyCode === 38) {       // key arrow up
    moveBlueChip(0, -1);
  } else if (event.keyCode == 40) { // key arrow down
    moveBlueChip(0, +1);
  } else if (event.keyCode == 37) { // key arrow left

  } else if (event.keyCode == 39) { // key arrow right

  }
}); 

// - - TESTING - - //

// loading('Wire Tapping');
// pauseBrowser(1000);
// popUpWindow('alarm');
// popUpWindow('clue');
// popUpWindow('time-out');


// - - RUNNING - - //
drawBoard();

drawDSTimer();

update();


