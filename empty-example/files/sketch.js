// Declare global variables
let grid; // 2D grid array
let pacManSpeed = 13; // Pac-Man's speed, ie update every 15 frames
let ghostSpeed = 15; // Note: higher number = higher speed, ie update every 15 frames
let frameCount = 0; // Frame counter
let path = []; // Array to store current path
let allowedUpdatePositions = []; // Array to store allowed update positions for ghosts
let showPath = false;
let playSound = false;

function initializeGhosts() {
  blinkyPath = aStar(blinky, pacman); // Recalculate path with A* algorithm

  inkyTarget = calculateInkyTarget();
  inkyPath = aStar(inky, inkyTarget);

  pinkyTarget = calculatePinkyTarget();
  pinkyPath = aStar(pinky, pinkyTarget);

  clydePath = aStar(clyde, pacman);
}

function updateGhostsEveryJunction() {
  if (allowedUpdatePositions.some(position => position.x === blinky.x && position.y === blinky.y)) {
    blinkyPath = aStar(blinky, pacman);
  }

  if (allowedUpdatePositions.some(position => position.x === inky.x && position.y === inky.y)) {
    inkyTarget = calculateInkyTarget();
    inkyPath = aStar(inky, inkyTarget);
  }

  if (allowedUpdatePositions.some(position => position.x === pinky.x && position.y === pinky.y)) {
    pinkyTarget = calculatePinkyTarget();
    pinkyPath = aStar(pinky, pinkyTarget);
  }

  if (allowedUpdatePositions.some(position => position.x === clyde.x && position.y === clyde.y)) {
    clydeTarget = calculateClydeTarget();
    clydePath = aStar(clyde, clydeTarget);
  }


  // Move ghosts
  if (frameCount % ghostSpeed === 0) {
    blinkyFollowPath(blinkyPath); // Follow path function to make Blinky follow path
    pinkyFollowPath(pinkyPath); // Follow path function to make Pinky follow path
    inkyFollowPath(inkyPath);
    clydeFollowPath(clydePath);
  }
}

function updateGhostsEveryFrame() {
  blinkyPath = aStar(blinky, pacman);

  inkyTarget = calculateInkyTarget();
  inkyPath = aStar(inky, inkyTarget);

  pinkyTarget = calculatePinkyTarget();
  pinkyPath = aStar(pinky, pinkyTarget);

  clydeTarget = calculateClydeTarget();
  clydePath = aStar(clyde, clydeTarget);

  // Move ghosts
  if (frameCount % ghostSpeed === 0) {
    blinkyFollowPath(blinkyPath); // Follow path function to make Blinky follow path
    pinkyFollowPath(pinkyPath); // Follow path function to make Pinky follow path
    inkyFollowPath(inkyPath);
    clydeFollowPath(clydePath);
  }
}

function drawEntities() {
  drawPacman();
  drawBlinky();
  drawPinky();
  drawInky();
  drawClyde();
}

function drawGhostPaths() {
  pacmanDrawPath(pacmanPath);
  blinkyDrawPath(blinkyPath); 
  pinkyDrawPath(pinkyPath);
  inkyDrawPath(inkyPath);
  clydeDrawPath(clydePath);
}

function preload() {
  // Load the images
  pacmanLoadImages();
  pacmanLoadSounds();

  blinkyLoadImages();
  clydeLoadImages();
  inkyLoadImages();
  pinkyLoadImages();
}

function resetGhosts() {
  startTime = millis();
  initializeGhosts(); // Toggle the vision visibility state

  pinkyReset();
  blinkyReset();
  clydeReset();
  inkyReset();

  blinkyPath = aStar(blinky, pacman);

  inkyTarget = calculateInkyTarget();
  inkyPath = aStar(inky, inkyTarget);

  pinkyTarget = calculatePinkyTarget();
  pinkyPath = aStar(pinky, pinkyTarget);

  clydeTarget = calculateClydeTarget();
  clydePath = aStar(clyde, clydeTarget);
}

function mouseClicked() {
  let tiles = getTiles();
  let tileX = tiles[0];
  let tileY = tiles[1];
  
  if (isValidMove(tileX, tileY)) {
    pacmanPathFind(tileX, tileY);
  }
}

// p5.js setup function that's called once at the beginning
function setup() {
  createCanvas(560, 620); // Create canvas with specific size
  grid = new Array(28).fill().map(() => new Array(31).fill(0)); // Initialize 2D grid array
  
  addWalls(); // Add walls to grid
  findJunctions();

  startTime = millis();
  initializeGhosts();

  // Get the button element and set up the event handler
  let vision_btn = select('#showPath');
  vision_btn.mousePressed(() => {
    showPath = !showPath; // Toggle the vision visibility state
  });

  // Get the button element and set up the event handler
  let reset_ghosts_btn = select('#resetGhosts');
  reset_ghosts_btn.mousePressed(() => {
    resetGhosts();
  });

  // Get the button element and set up the event handler
  let play_sound_btn = select('#playSound');
  play_sound_btn.mousePressed(() => {
    playSound = !playSound;
  });
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
    updateGhostsEveryJunction();
  }

  if (showPath) {
    drawGhostPaths();
  }
  drawEntities();
  handleKeys(); 

  frameCount++; // Increase frame count
}


