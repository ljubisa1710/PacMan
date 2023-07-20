// Initialize Pac-Man object
let pacman = {
    x: 13, // Pac-Man's x-coordinate
    y: 11, // Pac-Man's y-coordinate
    dir: 'RIGHT', // Pac-Man's initial direction
};

  // Function to draw Pac-Man
function drawPacman() {
    fill(255, 255, 0); // Yellow for Pac-Man
    circle(pacman.x * 20 + 10, pacman.y * 20 + 10, 18);
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
    if (isNotWall(newX, newY)) {
        pacman.x = newX;
        pacman.y = newY;
    }
}

// Function to handle key presses for direction
function handleKeys() {
    if (keyIsDown(LEFT_ARROW) && isNotWall(pacman.x - 1, pacman.y)) {
        pacman.dir = 'LEFT';
    } else if (keyIsDown(RIGHT_ARROW) && isNotWall(pacman.x + 1, pacman.y)) {
        pacman.dir = 'RIGHT';
    } else if (keyIsDown(UP_ARROW) && isNotWall(pacman.x, pacman.y - 1)) {
        pacman.dir = 'UP';
    } else if (keyIsDown(DOWN_ARROW) && isNotWall(pacman.x, pacman.y + 1)) {
        pacman.dir = 'DOWN';
    }
}