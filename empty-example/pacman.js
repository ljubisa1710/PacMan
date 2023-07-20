// Initialize Pac-Man object
let pacman = {
    x: 13, // Pac-Man's x-coordinate
    y: 11, // Pac-Man's y-coordinate
    dir: 'RIGHT', // Pac-Man's initial direction
};

let pacmanImages = [];
let imageTracker = 0;

function pacmanLoadImages() {
    pacmanImages[0] = loadImage('pictures/pacman/moving/pacman_1.png');
    pacmanImages[1] = loadImage('pictures/pacman/moving/pacman_2.png');
    pacmanImages[2] = loadImage('pictures/pacman/moving/pacman_3.png');
}

  // Function to draw Pac-Man
function drawPacman() {
    push(); // Save current transformation
    translate(pacman.x * 20 + 10, pacman.y * 20 + 10); // Move origin to Pac-Man's position

    // Determine the rotation based on Pac-Man's direction
    if (pacman.dir === 'LEFT') {
        rotate(PI); // PI is equivalent to 180 degrees
    } else if (pacman.dir === 'UP') {
        rotate(3 * PI / 2); // 3 * PI / 2 is equivalent to 270 degrees
    } else if (pacman.dir === 'DOWN') {
        rotate(PI / 2); // PI / 2 is equivalent to 90 degrees
    }

    image(pacmanImages[imageTracker], -10, -10, 20, 20); // Draw Pac-Man
    pop(); // Restore original transformation`
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

    // if(newX == 28 && newY == 14) {
    //     pacman.x = 0;
    //     pacman.y = 14;
    //     return;
    // }

    // if(newX == -1 && newY == 14) {
    //     pacman.x = 27;
    //     pacman.y = 14;
    //     return;
    // }

    // Check if the new position is a wall
    if (isNotWall(newX, newY)) {
        pacman.x = newX;
        pacman.y = newY;
        imageTracker++;
    }

    if (imageTracker == 3) {
        imageTracker = 0;
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