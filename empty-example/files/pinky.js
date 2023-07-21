// pinky's properties
let pinky = {
    x: 26, // pinky's x-coordinate
    y: 1, // pinky's y-coordinate
    dir: 'DOWN',
    prevX: -1,
    prevY: -1
};

let pinkyTarget;
let pinkyPath;

let pinkyImgUp;
let pinkyImgDown;
let pinkyImgLeft;
let pinkyImgRight;

function pinkyReset() {
    pinky.x = 26;
    pinky.y = 1;
    dir = 'DOWN';
    prevX = -1;
    prevY = -1;
}

function pinkyLoadImages() {
    pinkyImgDown = loadImage('pictures/ghosts/pinky/pinky_down.png');
    pinkyImgUp = loadImage('pictures/ghosts/pinky/pinky_up.png');
    pinkyImgLeft = loadImage('pictures/ghosts/pinky/pinky_left.png');
    pinkyImgRight = loadImage('pictures/ghosts/pinky/pinky_right.png');
}

// Function to calculate Pinky's target based on Pac-Man's direction
function calculatePinkyTarget() {
    let target = {x: pacman.x, y: pacman.y}; // Initialize target to Pac-Man's current location

    for (let i = 1; i <= 4; i++) { // Check up to 4 spaces ahead
        let newX = pacman.x;
        let newY = pacman.y;

        if (pacman.dir === 'LEFT') {
            newX -= i;
        } else if (pacman.dir === 'RIGHT') {
            newX += i;
        } else if (pacman.dir === 'UP') {
            newY -= i;
        } else if (pacman.dir === 'DOWN') {
            newY += i;
        }

        // Check if new position is out of bounds or a wall
        if (newX < 0 || newX >= grid.length || newY < 0 || newY >= grid[0].length || grid[newX][newY] === 1) {
            continue; // If it's a wall or out of bounds, stop checking
        } else {
            target = {x: newX, y: newY}; // If it's a valid position, update the target
        }
    }

    return target;
}

// Function for Pinky to follow a given path
function pinkyFollowPath(path) {
    let newX = pinky.x;
    let newY = pinky.y;
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
        if (!((pinky.dir === 'LEFT' && proposedDir === 'RIGHT') ||
              (pinky.dir === 'RIGHT' && proposedDir === 'LEFT') ||
              (pinky.dir === 'UP' && proposedDir === 'DOWN') ||
              (pinky.dir === 'DOWN' && proposedDir === 'UP'))) {
            pinky.dir = proposedDir;
        }
    }

    // Based on direction, set the new position
    switch (pinky.dir) {
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
        pinky.prevX = pinky.x;
        pinky.prevY = pinky.y;
        pinky.x = newX;
        pinky.y = newY;
    }

    // If Pinky has reached the next node, remove it from the path
    if (nextNode && pinky.x === nextNode.x && pinky.y === nextNode.y) {
        path.pop();
    }
}
  
function drawPinky() {
    switch(pinky.dir) {
        case 'LEFT':
            image(pinkyImgLeft, pinky.x * 20, pinky.y * 20, 20, 20);
            break;
        case 'RIGHT':
            image(pinkyImgRight, pinky.x * 20, pinky.y * 20, 20, 20);
            break;
        case 'UP':
            image(pinkyImgUp, pinky.x * 20, pinky.y * 20, 20, 20);
            break;
        case 'DOWN':
            image(pinkyImgDown, pinky.x * 20, pinky.y * 20, 20, 20);
            break;
        default:
            image(pinkyImgDown, pinky.x * 20, pinky.y * 20, 20, 20);
    }
}

// Function to draw a path using the A* algorithm
function pinkyDrawPath(path) {
    if (path) {
        for (let node of path) {
            fill(255, 204, 255); // Pink color for the path
            rect(node.x * 20, node.y * 20, 20, 20); // Draw rectangles for path
        }
    }
}
  