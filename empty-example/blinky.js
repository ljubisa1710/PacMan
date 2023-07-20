// Blinky's properties
let blinky = {
    x: 1, // Blinky's x-coordinate
    y: 1, // Blinky's y-coordinate
    dir: 'RIGHT',
    prevX: -1,
    prevY: -1
};

let blinkyPath;
  
function blinkyFollowPath(path) {
    if (path && path.length > 1) {
        let nextNode = path[path.length - 2]; // Take the last node in the path

        if (nextNode.x < blinky.x) {
            blinky.dir = 'LEFT';
        } else if (nextNode.x > blinky.x) {
            blinky.dir = 'RIGHT';
        } else if (nextNode.y < blinky.y) {
            blinky.dir = 'UP';
        } else if (nextNode.y > blinky.y) {
            blinky.dir = 'DOWN';
        }

        let newX = blinky.x;
        let newY = blinky.y;

        if (blinky.dir === 'LEFT') {
            newX--;
        } else if (blinky.dir === 'RIGHT') {
            newX++;
        } else if (blinky.dir === 'UP') {
            newY--;
        } else if (blinky.dir === 'DOWN') {
            newY++;
        }

        // Check if the new position is a wall
        if (grid[newX][newY] !== 1) {
            blinky.prevX = blinky.x
            blinky.prevY = blinky.y
            blinky.x = newX;
            blinky.y = newY;
        }

        // If Blinky has reached the next node, remove it from the path
        if (blinky.x == nextNode.x && blinky.y == nextNode.y) {
            path.pop();
        }
    } else {
        let newX = blinky.x;
        let newY = blinky.y;

        if (blinky.dir === 'LEFT') {
            newX--;
        } else if (blinky.dir === 'RIGHT') {
            newX++;
        } else if (blinky.dir === 'UP') {
            newY--;
        } else if (blinky.dir === 'DOWN') {
            newY++;
        }

        // Check if the new position is a wall and within array bounds
        if (isValidMove(newX, newY)) {
            blinky.prevX = blinky.x
            blinky.prevY = blinky.y
            blinky.x = newX;
            blinky.y = newY;
        }
    }
}
  
// Function to draw Blinky
function drawBlinky() {
    fill(255, 0, 0); // Red for Blinky
    circle(blinky.x * 20 + 10, blinky.y * 20 + 10, 18);
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
  