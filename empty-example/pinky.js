// pinky's properties
let pinky = {
    x: 13, // pinky's x-coordinate
    y: 17, // pinky's y-coordinate
    dir: 'LEFT', // pinky's initial direction
};
  
// Function for Pinky to follow a given path
function pinkyFollowPath(path) {
    if (path && path.length > 1) {
        let nextNode = path[path.length - 2]; // Take the last node in the path

        let dx = nextNode.x - pinky.x;
        let dy = nextNode.y - pinky.y;

        if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) {
            pinky.dir = 'RIGHT';
        } else {
            pinky.dir = 'LEFT';
        }
        } else {
        if (dy > 0) {
            pinky.dir = 'DOWN';
        } else {
            pinky.dir = 'UP';
        }
        }

        let newX = pinky.x;
        let newY = pinky.y;

        if (pinky.dir === 'LEFT') {
        newX--;
        } else if (pinky.dir === 'RIGHT') {
        newX++;
        } else if (pinky.dir === 'UP') {
        newY--;
        } else if (pinky.dir === 'DOWN') {
        newY++;
        }

        // Check if the new position is a wall and within array bounds
        if (isValidMove(newX, newY)) {
        pinky.x = newX;
        pinky.y = newY;
        }

        // If Pinky has reached the next node, remove it from the path
        if (pinky.x === nextNode.x && pinky.y === nextNode.y) {
        path.pop();
        }
    }
}
  
  
// Function to draw pinky
function drawPinky() {
    fill(0, 255, 0); // Red for pinky
    circle(pinky.x * 20 + 10, pinky.y * 20 + 10, 18);
}

// Function to draw a path using the A* algorithm
function pinkyDrawPath(path) {
    for (let node of path) {
      fill(0, 255, 0); // Green color for the path
      rect(node.x * 20, node.y * 20, 20, 20); // Draw rectangles for path
    }
  }
  