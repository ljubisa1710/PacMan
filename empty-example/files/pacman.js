// Initialize Pac-Man object
let pacman = {
    x: 13, // Pac-Man's x-coordinate
    y: 11, // Pac-Man's y-coordinate
    dir: 'RIGHT', // Pac-Man's initial direction
};

let isFollowingPath = false;
let pacmanTarget = {x: -1, y: -1}; // Initial target coordinates for Pac-Man
let pacmanPath;

let isPacmanDead = false;
let powerTime = false;
let ghostsEaten = 0;

let pacmanImages = [];
let imageTracker = 0;
let pacmanWaka;

let num_lives = 3;

function resetPacman() {
    pacman.x = 13; // Pac-Man's x-coordinate
    pacman.y = 11; // Pac-Man's y-coordinate
    pacman.dir = 'RIGHT'; // Pac-Man's initial direction
    isPacmanDead = false;
    isFollowingPath = false;
    pacmanTarget = {x: -1, y: -1};
    imageTracker = 0;
    powerTime = false;
}

function pacmanPlaySound() {
    pacmanWaka.play();
}

function pacmanLoadSounds() {
    pacmanWaka = loadSound('sounds/pacman_waka.mp3');
    pacmanWaka.setVolume(0.25);
    pacmanWaka.rate(1.75);
}

function pacmanLoadImages() {
    pacmanImages[0] = loadImage('pictures/pacman/moving/pacman_1.png');
    pacmanImages[1] = loadImage('pictures/pacman/moving/pacman_2.png');
    pacmanImages[2] = loadImage('pictures/pacman/moving/pacman_3.png');
}

function pacmanEatPellet() {
    // Iterate through the pellets array
    for (let i = 0; i < pellets.length; i++) {
        // Check if Pacman's coordinates match the current pellet's coordinates
        if (pellets[i].x === pacman.x && pellets[i].y === pacman.y) {
            // If they match, remove this pellet from the array
            pellets.splice(i, 1);
            // Since we found a match and removed a pellet, we can break the loop after increasing the score
            score = score + 10;
            break;
        }
    }

    // Iterate through the power pellets array
    for (let i = 0; i < powerPellets.length; i++) {
        // Check if Pacman's coordinates match the current pellet's coordinates
        if (powerPellets[i].x === pacman.x && powerPellets[i].y === pacman.y) {
            // If they match, remove this pellet from the array
            powerPellets.splice(i, 1);
            // Since we found a match and removed a pellet, we can break the loop after increasing the score
            score = score + 50;
            powerTime = true;
            setGhostsRunning();
            setTimeout(stopGhostsRunning, runningDuration);
            break;
        }
    }
}

function pacmanPathFind(tileX, tileY) {
    pacmanTarget = { x: tileX, y: tileY };
    // Calculate the new path for Pac-Man to follow
    pacmanPath = aStar(pacman, pacmanTarget);
    // Pac-Man starts following the new path
    isFollowingPath = true;
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
    if (isFollowingPath) {
        pacmanFollowPath(pacmanPath);
        if (pacmanPath.length === 0) {
            // Path is empty, so Pac-Man has reached the target and stops following the path
            isFollowingPath = false;
        }
    } else {

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

        // Check for the wraparound conditions
        if (newX < 0 && newY === 14) {
            newX = 27;
        } else if (newX > 27 && newY === 14) {
            newX = 0;
        }
        
        // Check to see if the new position matches the conditions you provided
        if ((newX === 13 && newY === 12) || (newX === 14 && newY === 12)) {
            return false;
        }

        // Check if the new position is a wall
        if (isValidMove(newX, newY)) {
            pacman.x = newX;
            pacman.y = newY;
            imageTracker++;
            if (playSound) {
                pacmanPlaySound();
            }
            pacmanEatPellet();
        }

        if (imageTracker == 3) {
            imageTracker = 0;
        }
    }
}

// Function to handle key presses for direction
function handleKeys() {
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

// Function for pacman to follow a given path
function pacmanFollowPath(path) {
    let newX = pacman.x;
    let newY = pacman.y;
    let nextNode = path ? path[path.length - 2] : null; // Take the last node in the path

    // If there's a path to follow, update direction accordingly
    if (nextNode) {
        let dx = nextNode.x - newX;
        let dy = nextNode.y - newY;
        let proposedDir;

        if (Math.abs(dx) > Math.abs(dy)) {
            proposedDir = dx > 0 ? 'RIGHT' : 'LEFT';
        } else {
            proposedDir = dy > 0 ? 'DOWN' : 'UP';
        }

        // Ensure the proposed direction is not a 180-degree turn
        if (!((pacman.dir === 'LEFT' && proposedDir === 'RIGHT') ||
              (pacman.dir === 'RIGHT' && proposedDir === 'LEFT') ||
              (pacman.dir === 'UP' && proposedDir === 'DOWN') ||
              (pacman.dir === 'DOWN' && proposedDir === 'UP'))) {
            pacman.dir = proposedDir;
        }
    }

    // Based on direction, set the new position
    switch (pacman.dir) {
        case 'LEFT':
            newX--;
            break;
        case 'RIGHT':
            newX++;
            break;
        case 'UP':
            newY--;
            break;
        case 'DOWN':
            newY++;
            break;
    }

    // Check for the wraparound conditions
    if (newY === 14) {
        if (newX < 0) newX = 27;
        else if (newX > 27) newX = 0;
    }

    // Check if the new position is a wall and within array bounds
    if (isValidMove(newX, newY)) {
        pacman.prevX = pacman.x;
        pacman.prevY = pacman.y;
        pacman.x = newX;
        pacman.y = newY;
        imageTracker++;
        if (playSound) {
            pacmanPlaySound();
        }
        pacmanEatPellet();
    }

    if (imageTracker == 3) {
        imageTracker = 0;
    }

    // If pacman has reached the next node, remove it from the path
    if (nextNode && pacman.x === nextNode.x && pacman.y === nextNode.y) {
        path.pop();
    }
}

// Function to draw a path using the A* algorithm
function pacmanDrawPath(path) {
    if (path) {
        for (let node of path) {
            fill(255, 255, 0); // Pink color for the path
            rect(node.x * 20, node.y * 20, 20, 20); // Draw rectangles for path
        }
    }
}

function pacmanStandardCollision() {
    if (pacman.x == blinky.x && pacman.y == blinky.y && blinkyRunning == false && blinkyDead == false) {
        num_lives--; 
        isPacmanDead = true;
    } else if (pacman.x == pinky.x && pacman.y == pinky.y && pinkyRunning == false && pinkyDead == false) {
        num_lives--; 
        isPacmanDead = true; 
    } else if (pacman.x == inky.x && pacman.y == inky.y && inkyRunning == false && inkyDead == false) {
        num_lives--; 
        isPacmanDead = true; 
    } else if (pacman.x == clyde.x && pacman.y == clyde.y && clydeRunning == false && clydeDead == false) {
        num_lives--; 
        isPacmanDead = true; 
    }
}

function pacmanEatGhosts() {
    if (pacman.x == blinky.x && pacman.y == blinky.y && blinkyRunning == true && blinkyDead == false) {
        ghostsEaten++;
        score += 200 ^ ghostsEaten;
        blinkyRunning = false;
        blinkyDead = true;
        blinkyChangeImage();
        blinkyHomePath();
    } else if (pacman.x == pinky.x && pacman.y == pinky.y && pinkyRunning == true && pinkyDead == false) {
        ghostsEaten++;
        score += 200 ^ ghostsEaten;
        pinkyRunning = false;
        pinkyDead = true;
        pinkyChangeImage();
        pinkyHomePath();
    } else if (pacman.x == inky.x && pacman.y == inky.y && inkyRunning == true && inkyDead == false) {
        ghostsEaten++;
        score += 200 ^ ghostsEaten;
        inkyRunning = false;
        inkyDead = true;
        inkyChangeImage();
        inkyHomePath();
    } else if (pacman.x == clyde.x && pacman.y == clyde.y && clydeRunning == true && clydeDead == false) {
        ghostsEaten++;
        score += 200 ^ ghostsEaten;
        clydeRunning = false;
        clydeDead = true;
        clydeChangeImage();
        clydeHomePath();
    }
}

function pacmanCollision() {
    pacmanStandardCollision();
    pacmanEatGhosts();
}

function pacmanFrameUpdate() {
  // Move Pac-Man every 'speed' frames
  if (frameCount % pacManSpeed === 0) {
    handleMovement();
  }
}