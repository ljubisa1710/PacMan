// Declare global variables
let pacman; // Pac-Man's properties
let grid; // 2D grid array
let pacManSpeed = 13; // Pac-Man's speed, ie update every 13 frames
let ghostSpeed = 15; // Note: higher number = higher speed, ie update every 15 frames
let frameCount = 0; // Frame counter
let target = {x: 15, y: 20}; // Initial target coordinates for Pac-Man
let isFollowingPath = false; // Boolean to check if Pac-Man is currently following a path
let path = []; // Array to store current path
let allowedUpdatePositions = []; // Array to store allowed update positions for ghosts

let blinkyPath;
let inkyPath;
let inkyTarget;
let pinkyTarget;
let pinkyPath;

function initializeGhosts() {
  blinkyPath = aStar(blinky, pacman); // Recalculate path with A* algorithm

  inkyTarget = calculateInkyTarget();
  inkyPath = aStar(inky, inkyTarget);

  pinkyTarget = calculatePinkyTarget();
  pinkyPath = aStar(pinky, pinkyTarget);
}

function updateGhosts() {
  // Move ghosts
  if (frameCount % ghostSpeed === 0) {
    blinkyFollowPath(blinkyPath); // Follow path function to make Blinky follow path
    pinkyFollowPath(pinkyPath); // Follow path function to make Pinky follow path
    inkyFollowPath(inkyPath);
  }

  if (allowedUpdatePositions.some(position => position.x === blinky.x && position.y === blinky.y)) {
    blinkyPath = aStar(blinky, pacman);
  }

  if (allowedUpdatePositions.some(position => position.x === inky.x && position.y === inky.y)) {
    inkyTarget = calculateInkyTarget();
    inkyPath = aStar(inky, inkyTarget);
  }

  if (allowedUpdatePositions.some(position => position.x === pinky.x && position.y === pinky.y)) {
    pinkyTarget = calculateInkyTarget();
    pinkyPath = aStar(pinky, pinkyTarget);
  }
}

function drawEntities() {
  drawPacman();
  drawBlinky();
  drawPinky();
  drawInky();
}

function drawGhostPaths() {
  blinkyDrawPath(blinkyPath); 
  pinkyDrawPath(pinkyPath);
  inkyDrawPath(inkyPath);
}

// p5.js setup function that's called once at the beginning
function setup() {
  createCanvas(560, 620); // Create canvas with specific size
  grid = new Array(28).fill().map(() => new Array(31).fill(0)); // Initialize 2D grid array
  
  addWalls(); // Add walls to grid
  findJunctions();

  startTime = millis();
  initializeGhosts();
}

// Function to handle mouse clicks
function mouseClicked() {
  let x = Math.floor(mouseX / 20);
  let y = Math.floor(mouseY / 20);
  console.log("Clicked tile coordinates: x =", x, ", y =", y);
}

// p5.js draw function that is called in a loop
function draw() {
  background(220); // Set background color
  drawGrid(); // Draw the grid

  // Move Pac-Man every 'speed' frames
  if (frameCount % pacManSpeed === 0) {
    handleMovement();
  }

  // Check if 5 seconds have passed
  if (millis() - startTime >= 5000) {
    updateGhosts();
  }

  drawGhostPaths();
  drawEntities();
  handleKeys(); 

  frameCount++; // Increase frame count
}


