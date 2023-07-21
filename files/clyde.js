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
  
function clydeFollowPath(path) {
    if (path && path.length > 1) {
        let nextNode = path[path.length - 2]; // Take the last node in the path

        if (nextNode.x < clyde.x) {
            clyde.dir = 'LEFT';
        } else if (nextNode.x > clyde.x) {
            clyde.dir = 'RIGHT';
        } else if (nextNode.y < clyde.y) {
            clyde.dir = 'UP';
        } else if (nextNode.y > clyde.y) {
            clyde.dir = 'DOWN';
        }

        let newX = clyde.x;
        let newY = clyde.y;

        if (clyde.dir === 'LEFT') {
            newX--;
        } else if (clyde.dir === 'RIGHT') {
            newX++;
        } else if (clyde.dir === 'UP') {
            newY--;
        } else if (clyde.dir === 'DOWN') {
            newY++;
        }

        // Check if the new position is a wall
        if (grid[newX][newY] !== 1) {
            clyde.prevX = clyde.x
            clyde.prevY = clyde.y
            clyde.x = newX;
            clyde.y = newY;
        }

        // If clyde has reached the next node, remove it from the path
        if (clyde.x == nextNode.x && clyde.y == nextNode.y) {
            path.pop();
        }
    } else {
        let newX = clyde.x;
        let newY = clyde.y;

        if (clyde.dir === 'LEFT') {
            newX--;
        } else if (clyde.dir === 'RIGHT') {
            newX++;
        } else if (clyde.dir === 'UP') {
            newY--;
        } else if (clyde.dir === 'DOWN') {
            newY++;
        }

        // Check if the new position is a wall and within array bounds
        if (isValidMove(newX, newY)) {
            clyde.prevX = clyde.x
            clyde.prevY = clyde.y
            clyde.x = newX;
            clyde.y = newY;
        }
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
  