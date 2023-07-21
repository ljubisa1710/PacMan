// inky's properties
let inky = {
    x: 26, // inky's x-coordinate
    y: 29, // inky's y-coordinate
    dir: 'LEFT',
    prevX: 26,
    prevY: 29
};

let inkyPath;
let inkyTarget;

let inkyImgUp;
let inkyImgDown;
let inkyImgLeft;
let inkyImgRight;

function inkyReset() {
    inky.x = 26;
    inky.y = 29;
    dir = 'LEFT';
    prevX = -1;
    prevY = -1;
}

function inkyLoadImages() {
    inkyImgDown = loadImage('pictures/ghosts/inky/inky_down.png');
    inkyImgUp = loadImage('pictures/ghosts/inky/inky_up.png');
    inkyImgLeft = loadImage('pictures/ghosts/inky/inky_left.png');
    inkyImgRight = loadImage('pictures/ghosts/inky/inky_right.png');
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

// Function for inky to follow a given path
function inkyFollowPath(path) {
    let newX = inky.x;
    let newY = inky.y;
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
        if (!((inky.dir === 'LEFT' && proposedDir === 'RIGHT') ||
              (inky.dir === 'RIGHT' && proposedDir === 'LEFT') ||
              (inky.dir === 'UP' && proposedDir === 'DOWN') ||
              (inky.dir === 'DOWN' && proposedDir === 'UP'))) {
            inky.dir = proposedDir;
        }
    }

    // Based on direction, set the new position
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
  