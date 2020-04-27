const canvas = document.getElementById('wiretap');
const context = canvas.getContext('2d');

const alarmRed = '#c00'

let myRAF; // myRAF = requestAnimationFrame

let boardTop = document.getElementById('board-top');
let boardBottom = document.getElementById('board-bottom');
let tileX = document.getElementById('tile-x');

let path01 = document.getElementById('path-01');
let path02 = document.getElementById('path-02');

let chip00 = document.getElementById('chip-00');
let chip01 = document.getElementById('chip-01');
let chip02 = document.getElementById('chip-02');


let timerInput = 1; // time for solving puzzle in min;
let timeSec01 = timerInput * 60 * 10;

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

function drawBoard() {
//  context.fillStyle = "#001";
//  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(boardTop, 0, 0);
  context.drawImage(boardBottom, 0, 707);
}

function drawTiles() {
  context.drawImage(chip02, 8+(32*19)+3, 748);
  for (j = 0; j < 5; j++) {
    for (i = 1; i < 14; i += 2) {
      context.drawImage(chip01, 10+(32*3) + 64 * i, (2*32) + (j*64*2) + 2);
      if (i < 12) {context.drawImage(path02, 10+(32*3) + 64 * (i+1), (2*33) + (j*64*2))};
    }
  }
}

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

function draw() {
  drawTiles();
//  context.drawImage(tile02, (32*19)+3, 745);
}

function update() {
  draw();
  myRAF = requestAnimationFrame(update);
}

document.addEventListener('keydown', event => {
  if (event.keyCode === 38) {
    popUpWindow('alarm');
  } else if (event.keyCode == 40) {
    popUpWindow('clue');
  } else if (event.keyCode == 37) { // key arrow left
    context.drawImage(boardTop, 0, 0);
  } else if (event.keyCode == 39) { // key arrow right
    popUpWindow('time-out');
  }
}); 

// - - RUNNING - - //

// loading('Wire Tapping');
// pauseBrowser(1000);

// - - TESTING - - //

drawBoard();

drawDSTimer();

update();


