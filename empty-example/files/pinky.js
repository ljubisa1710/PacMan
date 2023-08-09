// pinky's properties
let pinky = {
    x: 16, // pinky's x-coordinate
    y: 15, // pinky's y-coordinate
    dir: 'LEFT',
    prevX: -1,
    prevY: -1
};

let pinkyRunning = false;
let pinkyDead = false;
let pinkyScatter = false;

let pinkyTarget;
let pinkyPath;
let pinkyScatterTarget = {x: 26, y: 1};

let pinkyImgUp;
let pinkyImgDown;
let pinkyImgLeft;
let pinkyImgRight;

function pinkyReset() {
    pinky.x = 16;
    pinky.y = 15;
    dir = 'LEFT';
    prevX = -1;
    prevY = -1;
    pinkyRunning = false;
    pinkyDead = false;
    pinkyScatter = false;
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

function movePinkyRandomly() {
    let newX = pinky.x;
    let newY = pinky.y;
    
    // If pinky is currently moving in a direction, continue in that direction
    if (pinky.dir) {
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
        
        // If the next move in the same direction is valid, continue moving
        if (isValidMove(newX, newY)) {
            return {newX, newY};
        }
    }

    // If the above logic didn't return, pinky is either not moving or has reached a wall.
    // In this case, find a new random valid direction.
    let directions = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
    let validDirections = [];
    
    // Check each direction for validity
    for (let dir of directions) {
        let testX = pinky.x;
        let testY = pinky.y;
        
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
        
        if (isValidMove(testX, testY) && !(testX === pinky.prevX && testY === pinky.prevY)) {
            validDirections.push(dir);
        }
    }
    
    // Exclude the opposite direction to prevent 180-degree turns
    validDirections = validDirections.filter(dir => {
        return !((pinky.dir === 'LEFT' && dir === 'RIGHT') ||
                 (pinky.dir === 'RIGHT' && dir === 'LEFT') ||
                 (pinky.dir === 'UP' && dir === 'DOWN') ||
                 (pinky.dir === 'DOWN' && dir === 'UP'));
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
        
        pinky.dir = randomDirection;
    }

    return {newX, newY};
}

function movePinkyAlongPath(nextNode) {
    let newX = pinky.x;
    let newY = pinky.y;
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

    return {newX, newY};
}

function pinkyFollowPath(path) {
    let newX, newY;
    let nextNode = path ? path[path.length - 2] : null;

    // If path length is 1, move randomly
    if (path && path.length === 1) {
        let randomMove = movePinkyRandomly();
        newX = randomMove.newX;
        newY = randomMove.newY;
    } else if (nextNode) { // If there's a path to follow, update direction accordingly
        let pathMove = movePinkyAlongPath(nextNode);
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
        pinky.prevX = pinky.x;
        pinky.prevY = pinky.y;
        pinky.x = newX;
        pinky.y = newY;
    }

    // If pinky has reached the next node, remove it from the path
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

function updatePinkyMode() {
    let elapsedTime = millis() - modeStartTime;

    if (elapsedTime > scatterChaseSequence[currentModeIndex].duration) {
        // Switch to the next mode
        currentModeIndex++;
        
        // Reset the timer for the next mode
        modeStartTime = millis();
    }

    if (scatterChaseSequence[currentModeIndex].mode === "SCATTER") {
        pinkyScatter = true;
        pinkyRunning = false;
    } 
    else if (scatterChaseSequence[currentModeIndex].mode === "CHASE") {
        pinkyScatter = false;
        pinkyRunning = false; // Reset frightened mode when switching to chase
    }
}

function updatePinkyPath() {
    if (pinkyRunning) {
        movePinkyRandomly();
    } 
    else if (pinkyScatter) {
        pinkyPath = aStar(pinky, pinkyScatterTarget); // Target the scatter tile when in scatter mode
    } 
    else {
        pinkyTarget = calculatePinkyTarget();
        pinkyPath = aStar(pinky, pinkyTarget); // Target Pac-Man when in chase mode
    }
}

function pinkyFrameUpdate() {
    if (frameCount % ghostSpeed === 0) {
        pinkyFollowPath(pinkyPath); 
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
  