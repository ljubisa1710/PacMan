// clyde's properties
let clyde = {
    x: 1, // clyde's x-coordinate
    y: 29, // clyde's y-coordinate
    dir: 'RIGHT',
    prevX: -1,
    prevY: -1
};

let clydePath;
let clydeTarget;
let clydeRunTarget = {x: 1, y: 29};

let clydeImgUp;
let clydeImgDown;
let clydeImgLeft;
let clydeImgRight;

function clydeReset() {
    clyde.x = 1;
    clyde.y = 29;
    dir = 'RIGHT';
    prevX = -1;
    prevY = -1;
}

function clydeLoadImages() {
    clydeImgDown = loadImage('pictures/ghosts/clyde/clyde_down.png');
    clydeImgUp = loadImage('pictures/ghosts/clyde/clyde_up.png');
    clydeImgLeft = loadImage('pictures/ghosts/clyde/clyde_left.png');
    clydeImgRight = loadImage('pictures/ghosts/clyde/clyde_right.png');
}
  
function moveClydeRandomly() {
    let newX, newY, randomDirection;
    let directions = ['UP', 'DOWN', 'LEFT', 'RIGHT'];

    do {
        randomDirection = directions[Math.floor(Math.random() * directions.length)];
        newX = clyde.x;
        newY = clyde.y;

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
    } while (!isValidMove(newX, newY) || (newX === clyde.prevX && newY === clyde.prevY)); 

    // Ensure the random direction is not a 180-degree turn
    if (!((clyde.dir === 'LEFT' && randomDirection === 'RIGHT') ||
          (clyde.dir === 'RIGHT' && randomDirection === 'LEFT') ||
          (clyde.dir === 'UP' && randomDirection === 'DOWN') ||
          (clyde.dir === 'DOWN' && randomDirection === 'UP'))) {
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
        target = {x: clydeRunTarget.x, y: clydeRunTarget.y};
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

// Function to draw a path using the A* algorithm
function clydeDrawPath(path) {
    if (path) {
        for (let node of path) {
        fill(255, 165, 0); // orange color for the path
        rect(node.x * 20, node.y * 20, 20, 20); // Draw rectangles for path
        }
    }
  }
  