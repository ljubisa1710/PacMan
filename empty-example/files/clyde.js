// clyde's properties
let clyde = {
    x: 16, // clyde's x-coordinate
    y: 13, // clyde's y-coordinate
    dir: 'LEFT',
    prevX: -1,
    prevY: -1
};

let clydeRunning = false;
let clydeDead = false;
let clydeScatter = false;

let clydePath;
let clydeTarget;
let clydeScatterTarget = {x: 1, y: 29};

let clydeImgUp;
let clydeImgDown;
let clydeImgLeft;
let clydeImgRight;

function clydeReset() {
    clyde.x = 16;
    clyde.y = 13;
    dir = 'LEFT';
    prevX = -1;
    prevY = -1;
    clydeRunning = false;
    clydeDead = false;
    clydeScatter = false;
}

function clydeLoadImages() {
    clydeImgDown = loadImage('pictures/ghosts/clyde/clyde_down.png');
    clydeImgUp = loadImage('pictures/ghosts/clyde/clyde_up.png');
    clydeImgLeft = loadImage('pictures/ghosts/clyde/clyde_left.png');
    clydeImgRight = loadImage('pictures/ghosts/clyde/clyde_right.png');
}

function clydeChangeImage() {
    if (clydeRunning) {
        clydeImgDown = runningImgDown;
        clydeImgUp = runningImgUp;
        clydeImgLeft = runningImgLeft;
        clydeImgRight = runningImgRight;
    } else if (clydeDead) {
        clydeImgDown = deadImgDown;
        clydeImgUp = deadImgUp;
        clydeImgLeft = deadImgLeft;
        clydeImgRight = deadImgRight;
    } else {
        clydeImgDown = loadImage('pictures/ghosts/clyde/clyde_down.png');
        clydeImgUp = loadImage('pictures/ghosts/clyde/clyde_up.png');
        clydeImgLeft = loadImage('pictures/ghosts/clyde/clyde_left.png');
        clydeImgRight = loadImage('pictures/ghosts/clyde/clyde_right.png');
    }
}
  
function moveClydeRandomly() {
    let newX = clyde.x;
    let newY = clyde.y;
    
    // If clyde is currently moving in a direction, continue in that direction
    if (clyde.dir) {
        switch (clyde.dir) {
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

    // If the above logic didn't return, clyde is either not moving or has reached a wall.
    // In this case, find a new random valid direction.
    let directions = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
    let validDirections = [];
    
    // Check each direction for validity
    for (let dir of directions) {
        let testX = clyde.x;
        let testY = clyde.y;
        
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
        
        if (isValidMove(testX, testY) && !(testX === clyde.prevX && testY === clyde.prevY)) {
            validDirections.push(dir);
        }
    }
    
    // Exclude the opposite direction to prevent 180-degree turns
    validDirections = validDirections.filter(dir => {
        return !((clyde.dir === 'LEFT' && dir === 'RIGHT') ||
                 (clyde.dir === 'RIGHT' && dir === 'LEFT') ||
                 (clyde.dir === 'UP' && dir === 'DOWN') ||
                 (clyde.dir === 'DOWN' && dir === 'UP'));
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
        
        clyde.dir = randomDirection;
    }

    return {newX, newY};
}

function moveClydeAlongPath(nextNode) {
    let newX = clyde.x;
    let newY = clyde.y;
    let dx = nextNode.x - newX;
    let dy = nextNode.y - newY;
    let proposedDir;

    if (Math.abs(dx) > Math.abs(dy)) {
        proposedDir = dx > 0 ? 'RIGHT' : 'LEFT';
    } else {
        proposedDir = dy > 0 ? 'DOWN' : 'UP';
    }

    // Ensure the proposed direction is not a 180-degree turn
    if (!((clyde.dir === 'LEFT' && proposedDir === 'RIGHT') ||
          (clyde.dir === 'RIGHT' && proposedDir === 'LEFT') ||
          (clyde.dir === 'UP' && proposedDir === 'DOWN') ||
          (clyde.dir === 'DOWN' && proposedDir === 'UP'))) {
        clyde.dir = proposedDir;
    }

    switch (clyde.dir) {
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

function clydeFollowPath(path) {
    let newX, newY;
    let nextNode = path ? path[path.length - 2] : null;

    // If path length is 1, move randomly
    if (path && path.length === 1) {
        let randomMove = moveClydeRandomly();
        newX = randomMove.newX;
        newY = randomMove.newY;
    } else if (nextNode) { // If there's a path to follow, update direction accordingly
        let pathMove = moveClydeAlongPath(nextNode);
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
        clyde.prevX = clyde.x;
        clyde.prevY = clyde.y;
        clyde.x = newX;
        clyde.y = newY;
    }

    // If clyde has reached the next node, remove it from the path
    if (nextNode && clyde.x === nextNode.x && clyde.y === nextNode.y) {
        path.pop();
    }
}


function calculateClydeTarget() {
    let distance = Math.abs(clyde.x - pacman.x) + Math.abs(clyde.y - pacman.y);
    let target;

    if (distance > 8) {
        target = {x: pacman.x, y: pacman.y};
    } else {
        target = {x: clydeScatterTarget.x, y: clydeScatterTarget.y};
    }

    return target;
}
  
// Function to draw clyde
function drawClyde() {
    switch(clyde.dir) {
        case 'LEFT':
            image(clydeImgLeft, clyde.x * 20, clyde.y * 20, 20, 20);
            break;
        case 'RIGHT':
            image(clydeImgRight, clyde.x * 20, clyde.y * 20, 20, 20);
            break;
        case 'UP':
            image(clydeImgUp, clyde.x * 20, clyde.y * 20, 20, 20);
            break;
        case 'DOWN':
            image(clydeImgDown, clyde.x * 20, clyde.y * 20, 20, 20);
            break;
        default:
            image(clydeImgDown, clyde.x * 20, clyde.y * 20, 20, 20);
    }
}

function updateClydeMode() {
    let elapsedTime = millis() - modeStartTime;

    if (elapsedTime > scatterChaseSequence[currentModeIndex].duration) {
        // Switch to the next mode
        currentModeIndex++;
        
        // Reset the timer for the next mode
        modeStartTime = millis();
    }

    if (scatterChaseSequence[currentModeIndex].mode === "SCATTER") {
        clydeScatter = true;
        clydeRunning = false;
    } 
    else if (scatterChaseSequence[currentModeIndex].mode === "CHASE") {
        clydeScatter = false;
        clydeRunning = false; // Reset frightened mode when switching to chase
    }
}

function clydeHomePath() {
    clydePath = aStar(clyde, {x: 16, y: 13})
}

function clydeScatterPath() {
    clydePath = aStar(clyde, clydeScatterTarget);
}

function clydeChasePath() {
    clydePath = aStar(clyde, pacman);
}

function updateClydePath() {
    if (clydeDead) {
        clydeHomePath();
        if (clyde.x == 16 && clyde.y == 13) {
            clydeDead = false;
            clydeRunning = false;
            clydeChasePath();
            clydeChangeImage();
        }
    }
    else if (clydeRunning) {
        moveClydeRandomly();
    } 
    else if (clydeScatter) {
        clydeScatterPath(); // Target the scatter tile when in scatter mode
    } 
    else {
        clydeChasePath(); // Target Pac-Man when in chase mode
    }
}

function clydeFrameUpdate() {
    if (clydeRunning) {
        if (frameCount % ghostRunningSpeed === 0) {
            clydeFollowPath(clydePath); 
        }
    } else {
        if (frameCount % ghostSpeed === 0) {
            clydeFollowPath(clydePath); 
        }
    }
}

// Function to draw a path using the A* algorithm
function clydeDrawPath(path) {
    if (path) {
        for (let node of path) {
        fill(255, 165, 0); // orange color for the path
        rect(node.x * 20, node.y * 20, 20, 20); // Draw rectangles for path
        }
    }
  }
  