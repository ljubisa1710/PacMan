// Blinky's properties
let blinky = {
    x: 11, // Blinky's x-coordinate
    y: 13, // Blinky's y-coordinate
    dir: 'RIGHT',
    prevX: -1,
    prevY: -1
};

let blinkyRunning = false;
let blinkyDead = false;
let blinkyScatter = false;

let blinkyPath;
let blinkyScatterTarget = {x: 1, y: 1};

let blinkyImgUp;
let blinkyImgDown;
let blinkyImgLeft;
let blinkyImgRight;

function blinkyReset() {
    blinky.x = 11;
    blinky.y = 13;
    dir = 'RIGHT';
    prevX = -1;
    prevY = -1;
    blinkyRunning = false;
    blinkyDead = false;
    blinkyScatter = false;
}

function blinkyLoadImages() {
    blinkyImgDown = loadImage('pictures/ghosts/blinky/blinky_down.png');
    blinkyImgUp = loadImage('pictures/ghosts/blinky/blinky_up.png');
    blinkyImgLeft = loadImage('pictures/ghosts/blinky/blinky_left.png');
    blinkyImgRight = loadImage('pictures/ghosts/blinky/blinky_right.png');
}
  
function moveBlinkyRandomly() {
    let newX = blinky.x;
    let newY = blinky.y;
    
    // If blinky is currently moving in a direction, continue in that direction
    if (blinky.dir) {
        switch (blinky.dir) {
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
        
        // If next move in the same direction is valid, continue moving
        if (isValidMove(newX, newY)) {
            return {newX, newY};
        }
    }

    // If the above logic didn't return, blinky is either not moving or reached a wall.
    // In this case, find a new random valid direction.
    let directions = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
    let validDirections = [];
    
    // Check each direction for validity
    for (let dir of directions) {
        let testX = blinky.x;
        let testY = blinky.y;
        
        switch (dir) {
            case 'LEFT':
                testX--;
                break;
            case 'RIGHT':
                testX++;
                break;
            case 'UP':
                testY--;
                break;
            case 'DOWN':
                testY++;
                break;
        }
        
        if (isValidMove(testX, testY) && !(testX === blinky.prevX && testY === blinky.prevY)) {
            validDirections.push(dir);
        }
    }
    
    // Exclude opposite direction to prevent 180-degree turns
    validDirections = validDirections.filter(dir => {
        return !((blinky.dir === 'LEFT' && dir === 'RIGHT') ||
                 (blinky.dir === 'RIGHT' && dir === 'LEFT') ||
                 (blinky.dir === 'UP' && dir === 'DOWN') ||
                 (blinky.dir === 'DOWN' && dir === 'UP'));
    });

    if (validDirections.length > 0) {
        // Pick a random direction from the valid directions
        let randomDirection = validDirections[Math.floor(Math.random() * validDirections.length)];
        
        switch (randomDirection) {
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
        
        blinky.dir = randomDirection;
    }

    return {newX, newY};
}

function moveBlinkyAlongPath(nextNode) {
    let newX = blinky.x;
    let newY = blinky.y;
    let dx = nextNode.x - newX;
    let dy = nextNode.y - newY;
    let proposedDir;

    if (Math.abs(dx) > Math.abs(dy)) {
        proposedDir = dx > 0 ? 'RIGHT' : 'LEFT';
    } else {
        proposedDir = dy > 0 ? 'DOWN' : 'UP';
    }

    // Ensure the proposed direction is not a 180-degree turn
    if (!((blinky.dir === 'LEFT' && proposedDir === 'RIGHT') ||
          (blinky.dir === 'RIGHT' && proposedDir === 'LEFT') ||
          (blinky.dir === 'UP' && proposedDir === 'DOWN') ||
          (blinky.dir === 'DOWN' && proposedDir === 'UP'))) {
        blinky.dir = proposedDir;
    }

    switch (blinky.dir) {
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

    return {newX, newY};
}

function blinkyFollowPath(path) {
    let newX, newY;
    let nextNode = path ? path[path.length - 2] : null;

    // If path length is 1, move randomly
    if (path && path.length === 1) {
        let randomMove = moveBlinkyRandomly();
        newX = randomMove.newX;
        newY = randomMove.newY;
    } else if (nextNode) { // If there's a path to follow, update direction accordingly
        let pathMove = moveBlinkyAlongPath(nextNode);
        newX = pathMove.newX;
        newY = pathMove.newY;
    }

    // Check for the wraparound conditions
    if (newY === 14) {
        if (newX < 0) newX = 27;
        else if (newX > 27) newX = 0;
    }

    // Check if the new position is a wall and within array bounds
    if (isValidMove(newX, newY)) {
        blinky.prevX = blinky.x;
        blinky.prevY = blinky.y;
        blinky.x = newX;
        blinky.y = newY;
    }

    // If blinky has reached the next node, remove it from the path
    if (nextNode && blinky.x === nextNode.x && blinky.y === nextNode.y) {
        path.pop();
    }
}

function updateBlinkyMode() {
    let elapsedTime = millis() - modeStartTime;

    if (elapsedTime > scatterChaseSequence[currentModeIndex].duration) {
        // Switch to the next mode
        currentModeIndex++;
        
        // Reset the timer for the next mode
        modeStartTime = millis();
    }

    if (scatterChaseSequence[currentModeIndex].mode === "SCATTER") {
        blinkyScatter = true;
        blinkyRunning = false;
    } 
    else if (scatterChaseSequence[currentModeIndex].mode === "CHASE") {
        blinkyScatter = false;
        blinkyRunning = false; // Reset frightened mode when switching to chase
    }
}

function updateBlinkyPath() {
    if (blinkyRunning) {
        moveBlinkyRandomly();
    } 
    else if (blinkyScatter) {
        blinkyPath = aStar(blinky, blinkyScatterTarget); // Target the scatter tile when in scatter mode
    } 
    else {
        blinkyPath = aStar(blinky, pacman); // Target Pac-Man when in chase mode
    }
}

function blinkyFrameUpdate() {
    if (frameCount % ghostSpeed === 0) {
        blinkyFollowPath(blinkyPath); 
    }
}
  
// Function to draw Blinky
function drawBlinky() {
    switch(blinky.dir) {
        case 'LEFT':
            image(blinkyImgLeft, blinky.x * 20, blinky.y * 20, 20, 20);
            break;
        case 'RIGHT':
            image(blinkyImgRight, blinky.x * 20, blinky.y * 20, 20, 20);
            break;
        case 'UP':
            image(blinkyImgUp, blinky.x * 20, blinky.y * 20, 20, 20);
            break;
        case 'DOWN':
            image(blinkyImgDown, blinky.x * 20, blinky.y * 20, 20, 20);
            break;
        default:
            image(blinkyImgDown, blinky.x * 20, blinky.y * 20, 20, 20);
    }
}

// Function to draw a path using the A* algorithm
function blinkyDrawPath(path) {
    if (path) {
        for (let node of path) {
        fill(255, 0, 0); // Red color for the path
        rect(node.x * 20, node.y * 20, 20, 20); // Draw rectangles for path
        }
    }
  }
  