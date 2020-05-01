const canvas = document.getElementById('wiretap');
const context = canvas.getContext('2d');
let myRAF; // request Animation Frame var

const boardTop = document.getElementById('board-top');
const boardBottom = document.getElementById('board-bottom');

const path00 = document.getElementById('path-00');
const path01 = document.getElementById('path-01');
const path02 = document.getElementById('path-02');
const path31 = document.getElementById('path-31');
const path41 = document.getElementById('path-41');
const path51 = document.getElementById('path-51');
const path07 = document.getElementById('path-07');

const path23 = document.getElementById('path-02-3');


const chipA0 = document.getElementById('chip-A0');
const chipA1 = document.getElementById('chip-A1');
const chipP0 = document.getElementById('chip-P0');
const chipP1 = document.getElementById('chip-P1');

let chipSS = document.getElementById('chip-SS');

let chip00 = document.getElementById('chip-00');
let chip01 = document.getElementById('chip-01');
let chip02 = document.getElementById('chip-02');
let chip03 = document.getElementById('chip-03');
let chip04 = document.getElementById('chip-04');
let chip05 = document.getElementById('chip-05');
let chip06 = document.getElementById('chip-06');
let chip07 = document.getElementById('chip-07');
let chip08 = document.getElementById('chip-08');
let chip09 = document.getElementById('chip-09');
let chip10 = document.getElementById('chip-10');
let chip11 = document.getElementById('chip-11');
let chip12 = document.getElementById('chip-12');

let chip50 = document.getElementById('chip-50');
let chip51 = document.getElementById('chip-51');
let chip52 = document.getElementById('chip-52');
let chip53 = document.getElementById('chip-53');
let chip54 = document.getElementById('chip-54');
let chip55 = document.getElementById('chip-55');
let chip56 = document.getElementById('chip-56');
let chip57 = document.getElementById('chip-57');
let chip58 = document.getElementById('chip-58');
let chip59 = document.getElementById('chip-59');
let chip60 = document.getElementById('chip-60');
let chip61 = document.getElementById('chip-61');
let chip62 = document.getElementById('chip-62');

let pause = false;    // State of the game Pause
let lastTime = 0;   // tech variable for time counter
let lastDT = 16;    // tech variable for time counter
// GAME DIFFICULTY SETTINGS //
const timerInput = 10; // time for solving puzzle in min;
let timeRemain = timerInput * 60 * 1000; // countdown timer value in ms
const chipTypes = 12;   // Number of Chip Types at board
const nCP = 6; // number Of Crossed Paths in Between // Total Between-Path num = 24;
const nSC = 2; // number Of Sealed Chips
const nHC = 0; // number Of HIDDEN Chips
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
  context.fillRect(1026, 734, 200, 50);
  context.font = "36px Consolas";
  context.fillStyle = '#0f0';
  context.textAlign = "start";
  context.fillText(strTimer, 1046, 770);
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
        if (chipTypes < 7) matrix[i][j] = 1101 + Math.floor(Math.random() * chipTypes);
        else {
          let rnd = 1101 + Math.floor(Math.random()*(chipTypes - 2));
          matrix[i][j] = (rnd < 1103) ? rnd : rnd + 2;
        }
      }
    }
  // Correcting last column to remove combiners and splitters
    for (let i = 0; i < h; i++) {
      if ((matrix[i][w-1] > 1102) && (matrix[i][w-1] < 1107)) {
        matrix[i][w-1] = 1101 + Math.floor(Math.random() * 2);

      }
    }
   // removing combiners in case typeChips > 6
   if (chipTypes > 6)
    {

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

    matrix[player.pos.y][player.pos.x] += 100;    // Starting Blue Chip to be Substituted

    return matrix;
}

function correctChipSet() {
  let matrix = chipSet;
  let outSignals = 0;
  let signals = calculateSignalSet(signalSet);
  let w = signals[0].length;
  let wM = chipSet[0].length;

  for (let j=0; j<matrix.length; j++) {
    outSignals = 0;
    signals = calculateSignalSet(signalSet);
    for (let i = 0; i < signals.length; i++)
      outSignals += signals[i][w-1];
    if (outSignals > 0) {

      if (chipTypes<7) {
        if ((signals[j*2][0] == 1) && (signals[j*2+1][0] == 0)) 
            chipSet[j][0] = 1106;
        else if ((signals[j*2][0] == 0) && (signals[j*2+1][0] == 1)) 
            chipSet[j][0] = 1105;
      } 
      else { // ChipTypes >= 7

        if ((signals[j*2][w-2] == 1) && (signals[j*2+1][w-2] == 0)) 
            chipSet[j][wM-1] = 1107;
        else if ((signals[j*2][w-2] == 0) && (signals[j*2+1][w-2] == 1)) 
            chipSet[j][wM-1] = 1108;
        else if ((signals[j*2][w-2] == 1) && (signals[j*2+1][w-2] == 1)) 
            chipSet[j][wM-1] = 1109;
        else 
            chipSet[j][wM-1] = 1101 + Math.floor(Math.random()*2);
        }
    }
    else break;
  }
  return matrix;
}

function createTargetChipSet() {
  let matrix = [];
  let balance = [1, 1, 1, 1, 1, 0, 0, 0, 0, 0];
  for (let j = 0; j < 10; j++) {
    let index = Math.floor(Math.random()*balance.length);
    matrix[j] = parseInt(balance.splice(index, 1));
  }
return matrix;
}

function calculateTagetState(targetMatrix) {
  let res = targetMatrix;
  let w = signalSet[0].length;
  for (let j = 0; j < targetMatrix.length; j++) {
    if ((signalSet[j][w-1] == 1) && (targetMatrix[j] < 10)) res[j] += 10;
    else if ((signalSet[j][w-1] == 0) && (targetMatrix[j] >= 10)) res[j] -= 10;
  }
return res;
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

// INITIAL 5 signals set (1:0) -> (0:1) -> (1:0) ->
  for (let i = 0; i < h; i++) {
    if (i%2 == 0) {
      if (i%4 == 0) matrix[i][0] = 1;
      else matrix[i+1][0] = 1;
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
  sigOut.a = ((sigIn.a) == 1) ? 1 : 0;
  sigOut.z = sigOut.a;
} else if (tile == 06) {                  // Bottom Splitter CHIP
  sigOut.z = ((sigIn.z) == 1) ? 1 : 0;
  sigOut.a = sigOut.z;
} else if (tile == 07) {                  // Top Inverter CHIP
  sigOut.a = ((sigIn.a) == 1) ? 0 : 1;
  sigOut.z = sigIn.z;
} else if (tile == 08) {                  // Bottom Inverter CHIP
  sigOut.a = sigIn.a;
  sigOut.z = ((sigIn.z) == 1) ? 0 : 1;
} else if (tile == 09) {                  // Double Inverter CHIP
  sigOut.a = ((sigIn.a) == 1) ? 0 : 1;
  sigOut.z = ((sigIn.z) == 1) ? 0 : 1;
} else if (tile == 10) {                  // Top Crossover Inverter CHIP
  sigOut.a = sigIn.z;
  sigOut.z = ((sigIn.a) == 1) ? 0 : 1;
} else if (tile == 11) {                  // Bottom Crossover Inverter CHIP
  sigOut.a = ((sigIn.z) == 1) ? 0 : 1;
  sigOut.z = sigIn.a;
} else if (tile == 12) {                  // Double Crossover Inverter CHIP
  sigOut.a = ((sigIn.z) == 1) ? 0 : 1;
  sigOut.z = ((sigIn.a) == 1) ? 0 : 1;

// PATH Tiles LOGIC
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
  else {                 // a=z=7 For Debug Purposes only;
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
  chipSet[player.pos.y][player.pos.x] = freeChip + 100;
  freeChip = tempChip - 100;
}

// display layout for values PATH elements
function drawPathSet(matrix) {
  context.font = "20px Arial";
  context.fillStyle = '#ff0';
  context.textAlign = "center";
  let h = matrix.length;
  let tile;
  for (let i = 0; i < h; i++) {
    w = matrix[i].length;
    for (let j = 0; j < w; j++) {
      if (matrix[i][j] == 21) tile = path01;
      else if (matrix[i][j] == 22) tile = path02;
      else if (matrix[i][j] == 31) tile = path31;
      else if (matrix[i][j] == 41) tile = path41;
      else if (matrix[i][j] == 51) tile = path51;
      else if (matrix[i][j] == 07) tile = path07;
      else tile = path00;
      if (tile != path00) context.drawImage(tile, 234 + 128 * j, 51 + 64*i);
//  context.fillText(matrix[i][j], 260 + 128 * j, 105 + 64*i);

        }
      }
  }

function tileIdent(tile) {
  let mIJ = tile % 1000;
  let res = chip00;
  if (((tile % 100) - (tile % 10)) == 70) {
    res = (((tile % 1000)-(tile % 100)) == 200 ) ? chip50 : chip00;
  }
  else {
    if      (mIJ == 101) res = chip01;
    else if (mIJ == 102) res = chip02;
    else if (mIJ == 103) res = chip03;
    else if (mIJ == 104) res = chip04;
    else if (mIJ == 105) res = chip05;
    else if (mIJ == 106) res = chip06;
    else if (mIJ == 107) res = chip07;
    else if (mIJ == 108) res = chip08;
    else if (mIJ == 109) res = chip09;
    else if (mIJ == 110) res = chip10;
    else if (mIJ == 111) res = chip11;
    else if (mIJ == 112) res = chip12;

    else if (mIJ == 200) res = chip50;
    else if (mIJ == 201) res = chip51;
    else if (mIJ == 202) res = chip52;
    else if (mIJ == 203) res = chip53;
    else if (mIJ == 204) res = chip54;
    else if (mIJ == 205) res = chip55;
    else if (mIJ == 206) res = chip56;
    else if (mIJ == 207) res = chip57;
    else if (mIJ == 208) res = chip58;
    else if (mIJ == 209) res = chip59;
    else if (mIJ == 210) res = chip60;
    else if (mIJ == 211) res = chip61;
    else if (mIJ == 212) res = chip62;

    else res = chip50;
  }
  return res;
}

// Display layout for values of LOGIC CHIP elements
function drawChipSet(matrix) {
  let aj = 194;    let bj = 128;
  let ai = 105;    let bi = 128;
  context.font = "20px Arial";
  context.fillStyle = '#ffd';
  context.textAlign = "center";
  let h = matrix.length;
  let tile = chip00;
  for (let i = 0; i < h; i++) {
    w = matrix[i].length;
    for (let j = 0; j < w; j++) {
      context.drawImage(tileIdent(matrix[i][j]), 170 + bj*j, 50 + bi*i);
//      context.fillText(matrix[i][j], aj + bj*j, ai + bi*i);
    }   
  }
}

function drawTargetChipSet(matrix) {
  let tile = chipA0;
  for (let j = 0; j < 10; j++) {
    if      (matrix[j] === 0) tile = chipA0;
    else if (matrix[j] === 10) tile = chipA1;
    else if (matrix[j] === 1) tile = chipP0;
    else if (matrix[j] === 11) tile = chipP1; // (matrix[j] == 11)

    context.drawImage(tile, 1066 + (j%2)*96, (j*2+1)*32 - 13); 
//    context.fillText(matrix[j], 1090 + (j%2)*96, (j*2+1)*32 + 25)
  }
}

// Display FREE CHIP value & image
function drawFreeChip() {
  context.drawImage(tileIdent(freeChip), 619, 722);
//    context.fillText(freeChip, 192 + 150*3, 90 + 100*7);
  }

function drawSignalSet(matrix) {
  let h = matrix.length;
  let w = matrix[0].length;
  context.font = "20px Arial";
  context.textAlign = "center";
  for (let i = 0; i < h; i++) {
      for (let j = 0; j < w; j++) {
        context.fillStyle = (matrix[i][j] == 1) ? '#f00' : '#0f0';
        context.fillRect(146 + 64*j + j%2*20, 50 + 64*i - i%2*10, 10, 12)
 //       context.fillText(matrix[i][j], 150 + 64*j + j%2*20, 55 + 64*i + i%2*5);
      }
    }
}

function drawBoard() {
    context.drawImage(boardTop, 0, 0);
    context.drawImage(boardBottom, 0, 692);
    for (let i = 0; i < chipSet.length; i++) {
      for (let j = 0; j < chipSet[i].length; j++) {
        if (chipSet[i][j] / 1000 > 2) {
        context.drawImage(chipSS, 159 + 128*j, 38 + 128*i);
        }
      }   
    }   
}

// Main GAME LOOP including countdown time calculation
function update(time = 0) {
// CountDown Timer Calculations  
  let deltaTime = time - lastTime;
  if ((deltaTime > 20) || (deltaTime < 0)) {deltaTime = lastDT}
  lastTime = time;
  lastDT = deltaTime;

// Drawing Board, Path and Chip values, Timer

    drawBoard();
    
    drawPathSet(pathSet);
    drawChipSet(chipSet);
    drawFreeChip();
    
    signalSet = calculateSignalSet(signalSet);
    drawSignalSet(signalSet);

    targetChipSet = calculateTagetState(targetChipSet);
    drawTargetChipSet(targetChipSet);

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
// Creating GAME BOARD LAYOUT 
const player = {      // position of BLUE CHIP 
  pos: {y: 2, x: 3},
};
let freeChip = 1101 + (Math.floor(Math.random() * chipTypes)); // FREE CHIP type
// if ((freeChip > 1102) && (freeChip < 1107))  freeChip = 1101 + Math.floor(Math.random()*2); // FREE CHIP type correction

let chipSet = createChipSet(7, 5); // Create Initial Chip Set 
let targetChipSet = createTargetChipSet(); // Create Phones and Bells (5 x 5)
const pathSet = createPathSet(6,9); // Create Initial Path Layout
let signalSet = createSignalSet(14, 10); // Create Signal Matrix
chipSet = correctChipSet();

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
  else if ((event.keyCode == 80)) { // key 'p' = 80 unpause
    pause = false;
    update();
    }
  else if ((event.keyCode == 32)) { // key 'Space' to continue
  pause = false;
  update();
  }
}); 

// MAIN GAME LOOP Init
update();