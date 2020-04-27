const canvas = document.getElementById('wiretap');
const context = canvas.getContext('2d');

let timerInput = 1; // time for solving puzzle in min;
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
        matrix[i][j] = 1100 + (1 + Math.floor(Math.random() * 12));
      }
    }

    nSC = 4; // (Math.floor(Math.random() * 5)) // number Of Sealed Chips
    for (let i = 0; i < nSC; i++) {
      let xSC = (Math.floor(Math.random() * 5));
      let ySC = (Math.floor(Math.random() * 4));
      if (xDigit(matrix[xSC][ySC], 0) === 1) {
        matrix[xSC][ySC] += 1000;
      }
    }
    nHC = nSC * 3; // (Math.floor(Math.random() * 5)) // number Of HIDDEN Chips
    for (let i = 0; i < nHC; i++) {
      let xHC = (Math.floor(Math.random() * 5));
      let yHC = (Math.floor(Math.random() * 4));
      if ((xDigit(matrix[xHC][yHC], 0) === 1) & 
          (xDigit(matrix[xHC][yHC], 2) < 5)) {
        matrix[xHC][yHC] += 50;
      }
    }

    matrix[2][3] += 100;    // Starting Chip to be Substituted

    return matrix;
  }

function xDigit(number, dig) {
  let z = String(number);
  return parseInt(z[dig]);
}

function moveBlueChip(ox, oy) {
  chipSet[player.pos.y][player.pos.x] -= 100;
  player.pos.x +=ox;
  player.pos.y +=oy;
  chipSet[player.pos.y][player.pos.x] += 100;
}

function switchChips() {
  let tempChip = chipSet[player.pos.y][player.pos.x];
  if ((xDigit(tempChip, 2) >= 5)) {
    tempChip -= 50;
  }
  chipSet[player.pos.y][player.pos.x] = freeChip + 1100;
  freeChip = tempChip - 1100;
}

function drawMatrix(matrix) {
    context.fillStyle = "#001";
    context.fillRect(0, 0, canvas.width-100, canvas.height-100)
    context.font = "28px Arial";
    context.fillStyle = '#ffd';
    context.textAlign = "center";
    h = matrix.length;
    for (let i = 0; i < h; i++) {
        w = matrix[i].length;
        for (let j = 0; j < w; j++) {
            if (xDigit(matrix[i][j], 1) == 2) {
              context.fillStyle = '#00f';
              if ((xDigit(matrix[i][j], 2) >= 5)) {
                context.fillText('0000', 100 + 150*j, 100 + 100*i);
              } else {
                context.fillText(matrix[i][j], 100 + 150*j, 100 + 100*i);
              }
              context.fillStyle = '#ffd';
            } else if ((xDigit(matrix[i][j], 0) == 2)) {
              context.font = "36px Arial";
              context.fillText(matrix[i][j], 100 + 150*j, 100 + 100*i);
              context.font = "28px Arial";
            } else if ((xDigit(matrix[i][j], 2) >= 5)) {
              context.fillText('0000', 100 + 150*j, 100 + 100*i);
            } else {
              context.fillText(matrix[i][j], 100 + 150*j, 100 + 100*i);
            }
            
        }
      }
}

function drawFreeChip() {
  context.fillText(freeChip, 100 + 150*3, 100 + 100*6);
}

function update() {
    drawMatrix(chipSet);
    drawFreeChip();
    myRAF = requestAnimationFrame(update);
}

const chipSet = createChipSet(7, 5); // Create Initial Chip Set 
let freeChip = 100 + (Math.floor(Math.random() * 12));

const player = {
  pos: {y: 2, x: 3},
};

document.addEventListener('keydown', event => {
  if (event.keyCode === 38) {       // key arrow up
    if (player.pos.y > 0) {
      moveBlueChip(0, -1);
    }
  } else if (event.keyCode == 40) { // key arrow down
    if (player.pos.y < 4) {
      moveBlueChip(0, +1);
    }
  } else if (event.keyCode == 37) { // key arrow left
    if (player.pos.x > 0) {
      moveBlueChip(-1, 0);
    }
  } else if (event.keyCode == 39) { // key arrow right
    if (player.pos.x < 5) {
      moveBlueChip(+1, 0);
    }
  } else if (event.keyCode == 32) { // key Space
    if ((xDigit(chipSet[player.pos.y][player.pos.x], 0) !== 2)) {
      switchChips();
    }
  }
}); 

drawDSTimer();

update();