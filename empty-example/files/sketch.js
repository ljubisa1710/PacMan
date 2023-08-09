// Declare global variables
let grid; // 2D grid array
let pacManSpeed = 13; // Pac-Man's speed, ie update every 13 frames
let ghostSpeed = 15; // Note: higher number = lower speed, ie update every 15 frames
let ghostRunningSpeed = 17;
let startTime = 0;
let frameCount = 0; // Frame counter
let path = []; // Array to store current path
let allowedUpdatePositions = []; // Array to store allowed update positions for ghosts
let showPath = false;
let playSound = false;
let score = 0;
let grid_x = 27;
let grid_y = 30;
let ghostReleaseTime = 10 //Seconds
let ghostReleaseTimer = ghostReleaseTime * 1000; // Milliseconds

function initializeGhostPaths() {
  blinkyPath = aStar(blinky, pacman);

  inkyTarget = calculateInkyTarget();
  inkyPath = aStar(inky, inkyTarget);

  pinkyTarget = calculatePinkyTarget();
  pinkyPath = aStar(pinky, pinkyTarget);

  clydePath = aStar(clyde, pacman);
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
  loadRunningImages();

  pelletLoadImages();
}

function resetGhosts() {
  startTime = millis();
  currentTime = millis();  

  pinkyReset();
  blinkyReset();
  clydeReset();
  inkyReset();

  initializeGhostPaths();
}

function updateGhostsPaths() {
  updateBlinkyPath();
  updatePinkyPath();
  updateInkyPath();
  updateClydePath();
}

function mouseClicked() {
  let tiles = getTiles();
  let tileX = tiles[0];
  let tileY = tiles[1];
  console.log(tileX, tileY);
  
  if (isValidMove(tileX, tileY)) {
    pacmanPathFind(tileX, tileY);
  }
}

function resetGame() {
  pellets = [];
  addPellets(grid);

  resetPacman();
  resetGhosts();
  startTime = millis();
  currentTime = millis();

  score = 0;
  num_lives = 3;
}

function newLife() {
  resetPacman();
  resetGhosts();
  startTime = millis();
  currentTime = millis();
}

// p5.js setup function that's called once at the beginning
function setup() {
  createCanvas(560, 620); // Create canvas with specific size
  grid = new Array(grid_x+1).fill().map(() => new Array(grid_y+1).fill(0)); // Initialize 2D grid array
  
  addWalls(); // Add walls to grid
  addPellets(grid);
  findJunctions();

  startTime = millis();
  currentTime = millis();
  resetPacman();
  resetGhosts();
  initializeGhostPaths();

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

  let reset_game_btn = select('#resetGame');
  reset_game_btn.mousePressed(() => {
    resetGame(); // Toggle the vision visibility state
  });

}

function releaseGhosts() {
  let elapsed = millis() - startTime;

  if (elapsed >= ghostReleaseTimer) {
    blinkyFrameUpdate();
  }
  if (elapsed >= ghostReleaseTimer * 2) {
    pinkyFrameUpdate();
  }
  if (elapsed >= ghostReleaseTimer * 3) {
    inkyFrameUpdate();
  }
  if (elapsed >= ghostReleaseTimer * 4) {
    clydeFrameUpdate();
  }
}

function displayDeathScreen() {
  background(220);
  fill(0); // Text color
  textSize(32);
  textAlign(CENTER, CENTER);
  document.getElementById('lives').textContent = `Lives: ${num_lives}`;
  document.getElementById('score').textContent = `Score: ${score}`;
  text("You died!", width / 2, height / 2);
}

// p5.js draw function that is called in a loop
function draw() {
  background(220); // Set background color
  drawGrid(); // Draw the grid

  if (isPacmanDead && (num_lives <= 0)) {
    displayDeathScreen();
    return; // Exit the draw function early
  } else if (isPacmanDead && (num_lives > 0)) {
    newLife();
  }

  // Update the displayed score and lives
  document.getElementById('score').textContent = `Score: ${score}`;
  document.getElementById('lives').textContent = `Lives: ${num_lives}`;
  
  pacmanFrameUpdate();
  updateGhostsModes();
  updateGhostsPaths();
  releaseGhosts();

  if (showPath) {
    drawGhostPaths();
  }

  drawPellets();
  drawEntities();
  handleKeys(); 
  checkCollisionWithGhosts();

  frameCount++; // Increase frame count
}


