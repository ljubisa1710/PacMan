let runningImgDown;
let runningImgUp;
let runningImgLeft;
let runningImgRight;

let ghostsRunning = false;
let ghostsScatter = false;

let scatterChaseSequence = [
    { mode: "SCATTER", duration: 7000 },
    { mode: "CHASE", duration: 20000 },
    { mode: "SCATTER", duration: 7000 },
    { mode: "CHASE", duration: 20000 },
    { mode: "SCATTER", duration: 5000 },
    { mode: "CHASE", duration: 20000 },
    { mode: "SCATTER", duration: 5000 },
    { mode: "CHASE", duration: Infinity }  // Infinite chase after the last scatter
];

let currentModeIndex = 0;
let modeStartTime = 0;

function updateGhostsModes() {
    let elapsedTime = millis() - modeStartTime;

    if (elapsedTime > scatterChaseSequence[currentModeIndex].duration) {
        // Switch to the next mode
        currentModeIndex++;
        
        // Reset the timer for the next mode
        modeStartTime = millis();
    }

    if (scatterChaseSequence[currentModeIndex].mode === "SCATTER") {
        ghostsScatter = true;
        ghostsRunning = false;
    } 
    else if (scatterChaseSequence[currentModeIndex].mode === "CHASE") {
        ghostsScatter = false;
        ghostsRunning = false; // Reset frightened mode when switching to chase
    }
    
}

function loadRunningImages() {
  runningImgDown = loadImage('pictures/ghosts/running/running_down.png');
  runningImgUp = loadImage('pictures/ghosts/running/running_up.png');
  runningImgLeft = loadImage('pictures/ghosts/running/running_left.png');
  runningImgRight = loadImage('pictures/ghosts/running/running_right.png');
}

// Function to draw the grid
function drawGrid() {
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j] === 1) {
          fill(0); // Black for walls
        } else {
          fill(255); // White for empty space
        }
        rect(i * 20, j * 20, 20, 20);
      }
    }
  }


// Function to add walls to the grid
function addWallSection(x1, x2, y1, y2, mirror) {
    for (let i = x1; i <= x2; i++) {
        for (let j = y1; j <= y2; j++) {
            grid[i][j] = 1;
            if (mirror == true) {
                grid[27 - i][j] = 1; // Add mirrored walls if mirror is true
            }
        }
    }
}

function isValidMove(x, y) {
    
    if (isNaN(x) || isNaN(y)) {
        return false;
    }

    // Check array bounds
    if ((x < 0) || (y < 0) || (x > grid_x) || (y > grid_y)) {
        return false;
    }

    // Check if the position is a wall
    if (grid[x][y] === 1) {
        return false;
    }

    // If it's not out of bounds or a wall, it's a valid move
    return true;
}

// Function to add the layout of walls to the grid
function addWalls() {
    // Add walls around the edge of the grid
    for (let i = 0; i < 27; i++) {
      grid[i][0] = 1;
      grid[i][30] = 1;
    }
    for (let i = 0; i < 31; i++) {
      grid[0][i] = 1;
      grid[27][i] = 1;
    }

    addWallSection(10, 17, 6, 7, false);
    addWallSection(13, 14, 1, 4, false);
    addWallSection(13, 14, 8, 10, false);
    addWallSection(9, 11, 9, 10, true);
    addWallSection(7, 8, 6, 13, true);
    addWallSection(2, 5, 6, 7, true);
    addWallSection(2, 5, 2, 4, true);
    addWallSection(7, 11, 2, 4, true);
    addWallSection(1, 5, 9, 13, true);
    addWallSection(1, 5, 15, 19, true);
    addWallSection(10, 17, 12, 16, true);
    addWallSection(7, 8, 15, 19, true);
    addWallSection(10, 17, 18, 19, false);
    addWallSection(13, 14, 20, 22, false);
    addWallSection(2, 5, 21, 22, true);
    addWallSection(7, 11, 21, 22, true);
    addWallSection(4, 5, 23, 25, true);
    addWallSection(1, 2, 24, 25, true);
    addWallSection(7, 8, 24 ,26, true);
    addWallSection(2, 11, 27, 28, true);
    addWallSection(10, 17, 24, 25, false);
    addWallSection(13, 14, 26, 28, true);

    grid[27][14] = 0;
    grid[0][14] = 0;

    grid[13][12] = 0;
    grid[14][12] = 0;

    // Define hollow section dimensions 
    let hollowStartX = 11;
    let hollowEndX = 16;
    let hollowStartY = 13;
    let hollowEndY = 15;

    // Hollow out the middle section
    for (let i = hollowStartX; i <= hollowEndX; i++) {
        for (let j = hollowStartY; j <= hollowEndY; j++) {
            grid[i][j] = 0; // Making the section hollow
        }
    }
}

function getTiles() {
    // Get the tile width and height
    const tileWidth = width / grid.length;
    const tileHeight = height / grid[0].length;

    // Calculate the clicked tile's X and Y indices
    const tileX = Math.floor(mouseX / tileWidth);
    const tileY = Math.floor(mouseY / tileHeight);

    return [tileX, tileY];
}

// Function to find junctions on the grid
function findJunctions() {
  allowedUpdatePositions = []; // Clear the allowed update positions array

  // Iterate through the grid
  for (let x = 0; x < grid.length; x++) {
      for (let y = 0; y < grid[x].length; y++) {
      if (isJunction(x, y)) {
          allowedUpdatePositions.push({ x, y }); // Add junction coordinates to the allowed update positions array
      }
      }
  }
}

// Function to check if a given position is a junction
function isJunction(x, y) {
  if (grid[x][y] === 1) {
      return false; // Not a valid position
  }

  let adjacentPaths = 0; // Counter for adjacent paths

  // Check adjacent positions for paths
  if (isValidMove(x-1, y)) {
      adjacentPaths++;
  }
  if (isValidMove(x+1, y)) {
      adjacentPaths++;
  }
  if (isValidMove(x, y-1)) {
      adjacentPaths++;
  }
  if (isValidMove(x, y+1)) {
      adjacentPaths++;
  }

  if (adjacentPaths >= 3) {
      return true;
  } else if (adjacentPaths < 2) {
      return false;
  }

  if (adjacentPaths == 2) {
      let straight = false;

      if (isValidMove(x-1, y)) {
          if (isValidMove(x+1, y)) {
              straight = true;
          }
      }

      if (isValidMove(x, y-1)) {
          if (isValidMove(x, y+1)) {
              straight = true;
          }
      }

      if (straight) {
          return false;
      } else {
          return true;
      }
  }
}