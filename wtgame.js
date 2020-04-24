const canvas = document.getElementById('wiretap');
const context = canvas.getContext('2d');

let board = document.getElementById('board');
let tileX = document.getElementById('tile-x');

let timerInput = 0.25; // time for solving puzzle in min;
let timeSec = timerInput * 60

function drawTimer() {
  let timer = setInterval(myTimer, 1000);
  function myTimer() {
    let StrTimer = '00:00:00'
    if (timeSec < 0) {
      clearInterval(timer);
      alert("!!! ALARM !!!");
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
        context.fillStyle = '#a00'
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

// function updateTime() {
//   drawTimer();
//   requestAnimationFrame(updateTime);
// }

drawBoard();

drawTimer();
