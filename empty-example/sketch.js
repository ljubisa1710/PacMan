// Declare global variables
let pacman; // Pac-Man's properties
let grid; // 2D grid array
let speed; // Pac-Man's speed
let frameCount; // Frame counter
let target = {x: 15, y: 20}; // Initial target coordinates for Pac-Man
let isFollowingPath = false; // Boolean to check if Pac-Man is currently following a path
let path = []; // Array to store current path

// p5.js setup function that's called once at the beginning
function setup() {
  createCanvas(560, 620); // Create canvas with specific size
  grid = new Array(28).fill().map(() => new Array(31).fill(0)); // Initialize 2D grid array
  addWalls(); // Add walls to grid

  // Initialize Pac-Man object
  pacman = {
    x: 1, // Pac-Man's x-coordinate
    y: 1, // Pac-Man's y-coordinate
    dir: 'RIGHT', // Pac-Man's initial direction
  };

  speed = 12; // Set speed of Pac-Man
  frameCount = 0; // Initialize frame counter
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
}


// p5.js draw function that is called in a loop
function draw() {
  background(220); // Set background color
  drawGrid(); // Draw the grid
  blinkyPath = aStar(blinky, pacman); // Recalculate path with A* algorithm

  // Move Pac-Man every 'speed' frames
  if (frameCount % speed === 0) {
    blinkyFollowPath(blinkyPath); // Follow path function to make Pac-Man follow path
    handleMovement();
  }
  blinkyDrawPath(blinkyPath); // Draw the calculated path
  drawPacman(); // Draw Pac-Man
  drawBlinky();

  handleKeys(); 

  frameCount++; // Increase frame count
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

// Function to draw Pac-Man
function drawPacman() {
  fill(255, 255, 0); // Yellow for Pac-Man
  circle(pacman.x * 20 + 10, pacman.y * 20 + 10, 18);
}

// Function to check if a move is valid (not a wall)
function isValidMove(x, y) {
  return grid[x][y] !== 1;
}

// Function to handle Pac-Man's movement based on direction
function handleMovement() {
  let newX = pacman.x;
  let newY = pacman.y;

  if (pacman.dir === 'LEFT') {
    newX--;
  } else if (pacman.dir === 'RIGHT') {
    newX++;
  } else if (pacman.dir === 'UP') {
    newY--;
  } else if (pacman.dir === 'DOWN') {
    newY++;
  }

  // Check if the new position is a wall
  if (grid[newX][newY] !== 1) {
    pacman.x = newX;
    pacman.y = newY;
  }
}

// Function to handle key presses for direction
function handleKeys() {
  // Do not handle keys if Pac-Man is following a path
  if (isFollowingPath) {
    return;
  }

  if (keyIsDown(LEFT_ARROW) && isValidMove(pacman.x - 1, pacman.y)) {
    pacman.dir = 'LEFT';
  } else if (keyIsDown(RIGHT_ARROW) && isValidMove(pacman.x + 1, pacman.y)) {
    pacman.dir = 'RIGHT';
  } else if (keyIsDown(UP_ARROW) && isValidMove(pacman.x, pacman.y - 1)) {
    pacman.dir = 'UP';
  } else if (keyIsDown(DOWN_ARROW) && isValidMove(pacman.x, pacman.y + 1)) {
    pacman.dir = 'DOWN';
  }
}


