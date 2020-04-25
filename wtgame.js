const canvas = document.getElementById('wiretap');
const context = canvas.getContext('2d');

const alarmRed = '#c00'

let board = document.getElementById('board');
let tileX = document.getElementById('tile-x');

let timerInput = 0.10; // time for solving puzzle in min;
let timeSec = timerInput * 60;

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

function drawTimer() {
  let timer = setInterval(myTimer, 1000);
  function myTimer() {
    let StrTimer = '00:00:00'
    if (timeSec < 0) {
      clearInterval(timer);
      popUpWindow('time-out');
//      alert("!!! ALARM !!!");
    } else {
      h = Math.trunc(timeSec/60/60%60);
      m = Math.trunc(timeSec/60%60);
      s = timeSec%60; 
      strTimer = (h<10) ? `0${h}` : `${h}`;
      strTimer += (m<10) ? `:0${m}` : `:${m}`;
      strTimer += (s<10) ? `:0${s}` : `:${s}`;
      --timeSec;
      context.fillStyle = '#000';
      if ((timeSec < 10) && (timeSec % 2 != 0)) {
        context.fillStyle = '#c00'
      };
      context.fillRect(1010, 728, 205, 50);
      context.font = "36px Arial";
      context.fillStyle = '#0f0';
      context.textAlign = "start";
      context.fillText("T: " + strTimer, 1020, 765);
    }
  }
}

function drawBoard() {
  context.fillStyle = "#001";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(board, 0, 0);
  context.drawImage(tileX, 50, 50);
}

document.addEventListener('keydown', event => {
  if (event.keyCode === 38) {
    popUpWindow('alarm');
   } else if (event.keyCode == 40) {
     popUpWindow('clue');
   } else if (event.keyCode == 37) { // key arrow left
    drawBoard();
   } else if (event.keyCode == 39) { // key arrow right
    popUpWindow('time-out');
  }
}); 

// - - RUNNING - - //
drawTimer();

// - - TESTING - - //

drawBoard();
