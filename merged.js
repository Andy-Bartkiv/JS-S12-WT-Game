const canvas = document.getElementById('wiretap');
const context = canvas.getContext('2d');

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

let pause = false;    // State of the game Pause
const timerInput = 10; // time for solving puzzle in min;
let timeRemain = timerInput * 60 * 1000; // countdown timer value in ms
let lastTime = 0;   // tech variable for time counter
let lastDT = 16;    // tech variable for time counter
const chipTypes = 6;   // Number of Chip Types at board
const nCP = 10; // number Of Crossed Paths in Between // Total Between-Path num = 24;
const nSC = 1; // number Of Sealed Chips
const nHC = 1; // number Of HIDDEN Chips
//          chipTypes - nCP   - nSC   - nHC
// Beginner   =  6       4      0       0
// Easy       =  8      7-8     2       0
// Normal     = 10       8      4       11
// Hard       = 12    {11-13}   =5=   {12-18}


// pop-up message Window display
function popUpWindow(type = 'pause') {
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
  } else if (type == 'pause') {
    context.fillStyle = '#005';
    context.fillRect(440, 250, 400, 200);
    context.font = "64px Arial";
    context.fillStyle = '#fff';
    context.textAlign = "center";
    context.fillText("--- PAUSE ---", 640, 370);
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

// time formating to view '00:00:00'
function timeFormat(tR) {
  let strTimer = '00:00:00'
  let m = Math.trunc(tR/1000/60 % 60);
  let s = Math.trunc(tR/1000 % 60);
  let ds = Math.trunc(tR/10 % 100); 
  strTimer =  (m<10) ? `0${m}`  : `${m}`;
  strTimer += (s<10) ? `:0${s}` : `:${s}`;
  strTimer += (ds<10) ? `:0${ds}` : `:${ds}`;
  return strTimer;
}

  // new countdown timer display (calculations are made inside function update()
function drawNewTimer(tR) {
  strTimer = timeFormat(tR);
  context.fillStyle = '#000';
  if (((tR/1000) < 10) && (parseInt(strTimer[6]) % 10 < 5)) { //// RED LIGHT on Timer
    context.fillStyle = '#b00'
  };
  context.fillRect(1010, 760, 205, 50);
  context.font = "36px Consolas";
  context.fillStyle = '#0f0';
  context.textAlign = "start";
  context.fillText(strTimer, 1032, 796);
}

  // creating layout for PATH elements  6 х 9
function createPathSet(w, h) {
  const matrix = [];
  for (let i = 0; i < h; i++) {
    matrix[i] = []
    for (let j = 0; j < w; j++) {
      matrix[i][j] = 0;
    }
  }
  // number Of Crossed Paths in Between // Total Between-Path num = 24;
  for (let i = 0; i < nCP; i++) {
    let yCP = (Math.floor(Math.random() * (w)));
    let xCP = getRnd1357(1, h-2);
    if (matrix[xCP][yCP] === 0) {
      matrix[xCP][yCP] = 7;
    } else if (matrix[xCP][yCP] == 7) i--;
  }
  
  // Filling direct paths between chips 
  for (let i = 0; i < h; i++) { 
    if ((i%2 == 0) & (i == 0)) {
      for (let j = 0; j < w; j++) {
        if ((matrix[i+1][j]) == 7) {
          matrix[i][j] = 31;
        } else {
          matrix[i][j] = 21 + (Math.floor(Math.random()*2));
        }
      } // END inner j cycle END

    } else if ((i%2 == 0) & (i == h-1)) {
      for (let j = 0; j < w; j++) {
        if ((matrix[i-1][j]) == 7) {
          matrix[i][j] = 41;
        } else {
          matrix[i][j] = 21 + (Math.floor(Math.random()*2));
        }
      } // END inner j cycle END
    
    } else if (i%2 == 0) {
      for (let j = 0; j < w; j++) {
        if (((matrix[i+1][j])==7) & ((matrix[i-1][j])==7))  {
          matrix[i][j] = 51;
        } else if ((matrix[i+1][j]) == 7) {
          matrix[i][j] = 31;
        } else if ((matrix[i-1][j]) == 7) {
          matrix[i][j] = 41;
        } else {
          matrix[i][j] = 21 + (Math.floor(Math.random()*2));
        }
      } // inner j cycle END

    }  // if (i%2 == 0) statement END
  } // For i cycle END

  return matrix;
} // Function END

  // creating layout for LOGIC CHIP elements 7 х 5
function createChipSet(w, h) {
    const matrix = [];
    for (let i = 0; i < h; i++) {
      matrix[i] = []
      for (let j = 0; j < w; j++) {
        matrix[i][j] = 1100 + (1 + Math.floor(Math.random() * chipTypes));
      }
    }

   // - - - - - -  - - - - - - - - - - - - number Of Sealed Chips
    for (let i = 0; i < nSC; i++) {
      let xSC = (Math.floor(Math.random() * (w-2)));
      let ySC = (Math.floor(Math.random() * (h-1)));
      if (xDigit(matrix[xSC][ySC], 0) === 1) {
        matrix[xSC][ySC] += 1000;
      }
    }
// --------------------------------- // number Of HIDDEN Chips
    for (let i = 0; i < nHC; i++) {
      let xHC = (Math.floor(Math.random() * (w-2)));
      let yHC = (Math.floor(Math.random() * (h-1)));
      if ((xDigit(matrix[xHC][yHC], 0) === 1) & 
          (xDigit(matrix[xHC][yHC], 2) < 5)) {
        matrix[xHC][yHC] += 70;
      }
    }

    matrix[2][3] += 100;    // Starting Chip to be Substituted

    return matrix;
}

// creating SIGNAL Matrix 10 х 14
function createSignalSet(w, h) {
  const matrix = [];
  for (let i = 0; i < h; i++) {
    matrix[i] = []
    for (let j = 0; j < w; j++) {
      matrix[i][j] = 0;
    }
  }

// INITIAL 5 signals set 5 x (1:0)
  for (let i = 0; i < h; i++) {
    if (i%2 == 0) {
      matrix[i][0] = 1;
    }
  }

return matrix;
}

function calculateSignalSet(matrix) {
  let h = matrix.length;
  let w = matrix[0].length;
  let sigIn = {a:0, z:0};  // Input Signal
  let sigOut = {a:0, z:0}; // Output Signal

// CREATE TILE MATRIX
  let tileH = h / 2;
  let tileW = w - 1;
// New MATRIX = All LOGIC CHIPs, not all PATHSes; between lines PATHes are not included
  const tileMatrix = []; 
  for (let i = 0; i < tileH; i++) {
    tileMatrix[i] = []
    for (let j = 0; j < tileW; j++) {
      if (j%2 == 0) tileMatrix[i][j] = chipSet[i][j/2];
      else          tileMatrix[i][j] = pathSet[i*2][(j-1)/2];
    }
  }

  for (let j = 1; j < w; j++) { // iterate over columns w=14
    for (let i = 0; i < h/2; i++) {
      sigIn = {a: matrix[i*2][j-1], z: matrix[i*2+1][j-1]};
      let signal = {aa: 10, zz: 10};                        // Cross Signal - declaration
      if (j%2 == 0) {
        signal.aa = (i > 0) ? matrix[i*2-1][j-1] : 10       // Cross Signal from Top
        signal.zz = (i < h/2-1) ? matrix[i*2+2][j-1] : 10;  // Cross Signal from Bottom
      }                             
      sigOut = calculateTile(tileMatrix[i][j-1], sigIn, signal); // Tile processing th signals set

    // Output Signal is returned back into the MATRIX 
      matrix[i*2][j] = sigOut.a;
      matrix[i*2+1][j] = sigOut.z;
    } // END of i LOOP
  } // END of j LOOP
return matrix;
} // END of function calculate Signals END

function calculateTile(tile, sigIn, sigX) {
  let sigOut = {a:0, z:0}
// TILE NORMALIZATION to 2 last digits <= 12
  if (tile > 1000) tile = tile%1000;
  tile = tile % 100;
  if (tile > 70) tile -= 70;

//TILE TYPES 
if ((tile == 01) || (tile == 21)) {       // No action CHIP or PATH a=a, z=z
    sigOut = {a: sigIn.a, z: sigIn.z};
} else if ((tile == 02) || (tile == 22)) {// Crossover CHIP or PATH a=z, z=a
    sigOut = {a: sigIn.z, z: sigIn.a};
} else if (tile == 03) {                  // Top Combiner CHIP
    sigOut.a = ((sigIn.a + sigIn.z) > 0) ? 1 : 0;
    sigOut.z = 0;
} else if (tile == 04) {                  // Bottom Combiner CHIP
    sigOut.a = 0;
    sigOut.z = (((sigIn.a + sigIn.z) > 0)) ? 1 : 0;
} else if (tile == 05) {                  // Top Splitter CHIP
  sigOut.a = ((sigIn.a) > 0) ? 1 : 0;
  sigOut.z = sigOut.a;
} else if (tile == 06) {                  // Bottom Splitter CHIP
  sigOut.z = ((sigIn.z) > 0) ? 1 : 0;
  sigOut.a = sigOut.z;

} else if (tile == 31) {// PATH with signal from bottom line
  sigOut.a = sigIn.a;
  sigOut.z = sigX.zz;
} else if (tile == 41) {// PATH with signal from top line
  sigOut.a = sigX.aa;
  sigOut.z = sigIn.z;
} else if (tile == 51) {// PATH with signal from top AND bottom lines
  sigOut.a = sigX.aa;
  sigOut.z = sigX.zz;
}
  else {                 // a=z=0;
  sigOut = {a:7, z:7}
}

return sigOut;
} // END of function calculateTile

// getting digit position (dig) from a (number)
function xDigit(number, dig) {
  let z = String(number);
  return parseInt(z[dig]);
}
// getting Random UnEven number from a range
function getRnd1357(min, max) {
	let res, rnd = 0;
	do {
	  rnd = Math.floor(Math.random() * (max-min+1)) + min;
    res = (rnd%2) ? rnd : 0;
  } while (res == 0)
  return res
}

// moving Blue Chip (CHIP to be replaced with FREE CHIP) position in a certain direction
function moveBlueChip(ox, oy) {
  chipSet[player.pos.y][player.pos.x] -= 100;
  player.pos.x +=ox;
  player.pos.y +=oy;
  chipSet[player.pos.y][player.pos.x] += 100;
}

// swithcing Blue Chip and FREE CHIP
function switchChips() {
  let tempChip = chipSet[player.pos.y][player.pos.x];
  if ((xDigit(tempChip, 2) >= 5)) {
    tempChip -= 70;
  }
  chipSet[player.pos.y][player.pos.x] = freeChip + 1100;
  freeChip = tempChip - 1100;
}

// display layout for values PATH elements
function drawPathSet(matrix) {
    context.font = "20px Arial";
    context.fillStyle = '#ff0';
    context.textAlign = "center";
    h = matrix.length;
    for (let i = 0; i < h; i++) {
        w = matrix[i].length;
        for (let j = 0; j < w; j++) {
          context.fillText(matrix[i][j], 260 + 127 * j, 105 + 64*i);         
        }
      }
  }

// Display layout for values of LOGIC CHIP elements
function drawChipSet(matrix) {
    let aj = 194;
    let bj = 128;
    let ai = 105;
    let bi = 128;
    context.font = "20px Arial";
    context.fillStyle = '#ffd';
    context.textAlign = "center";
    h = matrix.length;
    for (let i = 0; i < h; i++) {
        w = matrix[i].length;
        for (let j = 0; j < w; j++) {
            if (xDigit(matrix[i][j], 1) == 2) {
              context.fillStyle = '#00f';
              if ((xDigit(matrix[i][j], 2) >= 5)) {
                context.fillText('0000', aj + bj*j, ai + bi*i);
              } else {
                context.fillText(matrix[i][j], aj + bj*j, ai + bi*i);
              }
              context.fillStyle = '#ffd';
            } else if ((xDigit(matrix[i][j], 0) == 2)) {
              context.font = "28px Arial";
              context.fillText(matrix[i][j], aj + bj*j, ai + bi*i);
              context.font = "20px Arial";
            } else if ((xDigit(matrix[i][j], 2) >= 5)) {
              context.fillText('0000', aj + bj*j, ai + bi*i);
            } else {
              context.fillText(matrix[i][j], aj + bj*j, ai + bi*i);
            }
            
        }
      }
}

// Display FREE CHIP value
function drawFreeChip() {
    context.fillText(freeChip, 192 + 150*3, 90 + 100*7);
  }

function drawSignalSet(matrix) {
  let h = matrix.length;
  let w = matrix[0].length;
  context.font = "20px Arial";
  context.textAlign = "center";
  for (let i = 0; i < h; i++) {
      for (let j = 0; j < w; j++) {
        context.fillStyle = (matrix[i][j] == 1) ? '#30f' : '#0f0';
        context.fillText(matrix[i][j], 150 + 64*j + j%2*20, 70 + 64*i + i%2*5);
      }
    }
}

function drawBoard() {
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

// Main GAME LOOP including countdown time calculation
function update(time = 0) {
// CountDown Timer Calculations  
  let deltaTime = time - lastTime;
  if ((deltaTime > 20) || (deltaTime < 0)) {deltaTime = lastDT}
  lastTime = time;
  lastDT = deltaTime;
// Drawing Black Board, Path and Chip values, Timer

    drawBoard()
    
    context.drawImage(chipA0, 10+(32*3) + 64 * 15, (1*32) + 2);  // ALARM CHIP
    context.drawImage(chipA1, 10+(32*3) + 64 * 15, (5*32) + 2);  // ALARM CHIP
  
    context.drawImage(chipP0, 10+(32*3) + 33*32, (3*32) + 2);  // PHONE CHIP
    context.drawImage(chipP1, 10+(32*3) + 33*32, (7*32) + 2);  // PHONE CHIP

    drawPathSet(pathSet);
    drawChipSet(chipSet);
    drawFreeChip();
    
    signalSet = calculateSignalSet(signalSet);
    drawSignalSet(signalSet);

    drawNewTimer(timeRemain);
    timeRemain -= deltaTime;


// ANIMATION FRAME LOGIC
    if ((timeRemain > 0) && (!pause)) {
      myRAF = requestAnimationFrame(update);
    } else if (pause) {
        popUpWindow('pause');
    } else if (timeRemain <= 0) {
        timeRemain = 0;
        drawNewTimer(timeRemain);
        cancelAnimationFrame(myRAF);
        popUpWindow('time-out');
    }
}

const chipSet = createChipSet(7, 5); // Create Initial Chip Set 
let freeChip = 101 + (Math.floor(Math.random() * chipTypes));
const pathSet = createPathSet(6,9); // Create Initial Path Layout
let signalSet = createSignalSet(14, 10); // Create Signal Matrix

const player = { // position of BLUE CHIP 
  pos: {y: 2, x: 3},
};

// KEYBOARD CONTROLS:
//                    arrows: to move bleu chip
//                    space : to switch Blue and Free Chips
//                 'p' & 'o': to pause and unpause game  
document.addEventListener('keydown', event => {
  if (!pause) {
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
    } else if (event.keyCode == 32) { // key Space 32
        if ((xDigit(chipSet[player.pos.y][player.pos.x], 0) !== 2)) {
          switchChips();
        }
    } else if (event.keyCode == 80) { // key 'p' 80
        pause = true;
        tt = timeRemain;
    }
  }
 else if ((event.keyCode == 79)) { // key 'o' 79
    pause = false;
    update();
    }
}); 

// MAIN GAME LOOP Init
update();