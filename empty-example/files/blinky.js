// Blinky's properties
let blinky = {
    x: 1, // Blinky's x-coordinate
    y: 1, // Blinky's y-coordinate
    dir: 'RIGHT',
    prevX: -1,
    prevY: -1
};

let blinkyPath;

let blinkyImgUp;
let blinkyImgDown;
let blinkyImgLeft;
let blinkyImgRight;

function blinkyReset() {
    blinky.x = 1;
    blinky.y = 1;
    dir = 'RIGHT';
    prevX = -1;
    prevY = -1;
}

function blinkyLoadImages() {
    blinkyImgDown = loadImage('pictures/ghosts/blinky/blinky_down.png');
    blinkyImgUp = loadImage('pictures/ghosts/blinky/blinky_up.png');
    blinkyImgLeft = loadImage('pictures/ghosts/blinky/blinky_left.png');
    blinkyImgRight = loadImage('pictures/ghosts/blinky/blinky_right.png');
}
  
// Function for blinky to follow a given path
function blinkyFollowPath(path) {
    let newX = blinky.x;
    let newY = blinky.y;
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
        if (!((blinky.dir === 'LEFT' && proposedDir === 'RIGHT') ||
              (blinky.dir === 'RIGHT' && proposedDir === 'LEFT') ||
              (blinky.dir === 'UP' && proposedDir === 'DOWN') ||
              (blinky.dir === 'DOWN' && proposedDir === 'UP'))) {
            blinky.dir = proposedDir;
        }
    }

    // Based on direction, set the new position
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
  