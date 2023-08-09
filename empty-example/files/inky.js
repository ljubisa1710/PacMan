// inky's properties
let inky = {
    x: 11, // inky's x-coordinate
    y: 15, // inky's y-coordinate
    dir: 'RIGHT',
    prevX: 26,
    prevY: 29
};

let inkyRunning = false;
let inkyDead = false;
let inkyScatter = false;

let inkyPath;
let inkyTarget;
let inkyScatterTarget = {x: 26, y: 29};

let inkyImgUp;
let inkyImgDown;
let inkyImgLeft;
let inkyImgRight;

function inkyReset() {
    inky.x = 11;
    inky.y = 15;
    dir = 'RIGHT';
    prevX = -1;
    prevY = -1;
    inkyRunning = false;
    inkyDead = false;
    inkyScatter = false;
}

function inkyLoadImages() {
    inkyImgDown = loadImage('pictures/ghosts/inky/inky_down.png');
    inkyImgUp = loadImage('pictures/ghosts/inky/inky_up.png');
    inkyImgLeft = loadImage('pictures/ghosts/inky/inky_left.png');
    inkyImgRight = loadImage('pictures/ghosts/inky/inky_right.png');
}

function inkyChangeImage() {
    if (inkyRunning) {
        inkyImgDown = runningImgDown;
        inkyImgUp = runningImgUp;
        inkyImgLeft = runningImgLeft;
        inkyImgRight = runningImgRight;
    } else if (inkyDead) {
        inkyImgDown = deadImgDown;
        inkyImgUp = deadImgUp;
        inkyImgLeft = deadImgLeft;
        inkyImgRight = deadImgRight;
    } else {
        inkyImgDown = loadImage('pictures/ghosts/inky/inky_down.png');
        inkyImgUp = loadImage('pictures/ghosts/inky/inky_up.png');
        inkyImgLeft = loadImage('pictures/ghosts/inky/inky_left.png');
        inkyImgRight = loadImage('pictures/ghosts/inky/inky_right.png');
    }
}


// Function to calculate Inky's target based on Pac-Man's and Blinky's positions
function calculateInkyTarget() {

    // Get the position two tiles in front of Pac-Man
    let intermediateTarget = {
        x: pacman.dir === 'LEFT' ? pacman.x - 2 : pacman.dir === 'RIGHT' ? pacman.x + 2 : pacman.x,
        y: pacman.dir === 'UP' ? pacman.y - 2 : pacman.dir === 'DOWN' ? pacman.y + 2 : pacman.y
    };

    // Now calculate the vector from Blinky to this position and double it
    let target = {
        x: (intermediateTarget.x - blinky.x) * 2 + blinky.x,
        y: (intermediateTarget.y - blinky.y) * 2 + blinky.y
    };

    // Ensure the target is a valid position, if not, find the closest valid position
    if (!isValidMove(target.x, target.y)) {
        let minDistance = Number.MAX_VALUE;
        let closestValidPos = {x: target.x, y: target.y};

        // Iterate over the entire grid and find the closest valid position
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[0].length; j++) {
                if (isValidMove(i, j) && inky.x != i && inky.y != j) {
                    let distance = Math.abs(i - target.x) + Math.abs(j - target.y);
                    if (distance < minDistance) {
                        minDistance = distance;
                        closestValidPos = {x: i, y: j};
                    }
                }
            }
        }

        target = closestValidPos;
    }

    return target;
}

function moveInkyRandomly() {
    let newX = inky.x;
    let newY = inky.y;
    
    // If inky is currently moving in a direction, continue in that direction
    if (inky.dir) {
        switch (inky.dir) {
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

    // If the above logic didn't return, inky is either not moving or has reached a wall.
    // In this case, find a new random valid direction.
    let directions = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
    let validDirections = [];
    
    // Check each direction for validity
    for (let dir of directions) {
        let testX = inky.x;
        let testY = inky.y;
        
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
        
        if (isValidMove(testX, testY) && !(testX === inky.prevX && testY === inky.prevY)) {
            validDirections.push(dir);
        }
    }
    
    // Exclude the opposite direction to prevent 180-degree turns
    validDirections = validDirections.filter(dir => {
        return !((inky.dir === 'LEFT' && dir === 'RIGHT') ||
                 (inky.dir === 'RIGHT' && dir === 'LEFT') ||
                 (inky.dir === 'UP' && dir === 'DOWN') ||
                 (inky.dir === 'DOWN' && dir === 'UP'));
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
        
        inky.dir = randomDirection;
    }

    return {newX, newY};
}

function moveInkyAlongPath(nextNode) {
    let newX = inky.x;
    let newY = inky.y;
    let dx = nextNode.x - newX;
    let dy = nextNode.y - newY;
    let proposedDir;

    if (Math.abs(dx) > Math.abs(dy)) {
        proposedDir = dx > 0 ? 'RIGHT' : 'LEFT';
    } else {
        proposedDir = dy > 0 ? 'DOWN' : 'UP';
    }

    // Ensure the proposed direction is not a 180-degree turn
    if (!((inky.dir === 'LEFT' && proposedDir === 'RIGHT') ||
          (inky.dir === 'RIGHT' && proposedDir === 'LEFT') ||
          (inky.dir === 'UP' && proposedDir === 'DOWN') ||
          (inky.dir === 'DOWN' && proposedDir === 'UP'))) {
        inky.dir = proposedDir;
    }

    switch (inky.dir) {
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

function inkyFollowPath(path) {
    let newX, newY;
    let nextNode = path ? path[path.length - 2] : null;

    // If path length is 1, move randomly
    if (path && path.length === 1) {
        let randomMove = moveInkyRandomly();
        newX = randomMove.newX;
        newY = randomMove.newY;
    } else if (nextNode) { // If there's a path to follow, update direction accordingly
        let pathMove = moveInkyAlongPath(nextNode);
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
        inky.prevX = inky.x;
        inky.prevY = inky.y;
        inky.x = newX;
        inky.y = newY;
    }

    // If inky has reached the next node, remove it from the path
    if (nextNode && inky.x === nextNode.x && inky.y === nextNode.y) {
        path.pop();
    }
}

function updateInkyMode() {
    let elapsedTime = millis() - modeStartTime;

    if (elapsedTime > scatterChaseSequence[currentModeIndex].duration) {
        // Switch to the next mode
        currentModeIndex++;
        
        // Reset the timer for the next mode
        modeStartTime = millis();
    }

    if (scatterChaseSequence[currentModeIndex].mode === "SCATTER") {
        inkyScatter = true;
        inkyRunning = false;
    } 
    else if (scatterChaseSequence[currentModeIndex].mode === "CHASE") {
        inkyScatter = false;
        inkyRunning = false; // Reset frightened mode when switching to chase
    }
}

function inkyHomePath() {
    inkyPath = aStar(inky, {x: 11, y: 15})
}

function inkyScatterPath() {
    inkyPath = aStar(inky, inkyScatterTarget);
}

function inkyChasePath() {
    inkyPath = aStar(inky, pacman);
}

function updateInkyPath() {
    if (inkyDead) {
        inkyHomePath();
        if (inky.x == 11 && inky.y == 15) {
            inkyDead = false;
            inkyRunning = false;
            inkyChasePath();
            inkyChangeImage();
        }
    }
    else if (inkyRunning) {
        moveInkyRandomly();
    } 
    else if (inkyScatter) {
        inkyScatterPath(); // Target the scatter tile when in scatter mode
    } 
    else {
        inkyChasePath(); // Target Pac-Man when in chase mode
    }
}

function inkyFrameUpdate() {
    if (inkyRunning) {
        if (frameCount % ghostRunningSpeed === 0) {
            inkyFollowPath(inkyPath); 
        }
    } else {
        if (frameCount % ghostSpeed === 0) {
            inkyFollowPath(inkyPath); 
        }
    }
}
   
// Function to draw inky
function drawInky() {
    switch(inky.dir) {
        case 'LEFT':
            image(inkyImgLeft, inky.x * 20, inky.y * 20, 20, 20);
            break;
        case 'RIGHT':
            image(inkyImgRight, inky.x * 20, inky.y * 20, 20, 20);
            break;
        case 'UP':
            image(inkyImgUp, inky.x * 20, inky.y * 20, 20, 20);
            break;
        case 'DOWN':
            image(inkyImgDown, inky.x * 20, inky.y * 20, 20, 20);
            break;
        default:
            image(inkyImgDown, inky.x * 20, inky.y * 20, 20, 20);
    }
}

// Function to draw a path using the A* algorithm
function inkyDrawPath(path) {
    if (path) {
        for (let node of path) {
            fill(0,255,255); // Blue color for the path
            rect(node.x * 20, node.y * 20, 20, 20); // Draw rectangles for path
        }
    }
}
  