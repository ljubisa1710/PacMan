// A* algorithm to find the shortest path
function aStar(ghost, pacman) {
    // Initialize necessary arrays and objects
    let openSet = [ghost];
    let cameFrom = {};
    let gScore = {};
    let fScore = {};

    // Assign each grid cell an initial cost of Infinity
    for (let i = 0; i < 40; i++) {
        for (let j = 0; j < 40; j++) {
            gScore[`${i},${j}`] = Infinity;
            fScore[`${i},${j}`] = Infinity;
        }
    }

    // The cost of the ghost position is 0
    gScore[`${ghost.x},${ghost.y}`] = 0;
    // For the ghost node, the fScore is completely heuristic
    fScore[`${ghost.x},${ghost.y}`] = heuristic(ghost, pacman);

    // While there are still nodes to evaluate
    while (openSet.length > 0) {
        // Get the node in openSet having the lowest fScore[] value
        let current = openSet.reduce((a, b) => fScore[`${a.x},${a.y}`] < fScore[`${b.x},${b.y}`] ? a : b);

        // If the current node is the pacman, then we are done
        if (current.x === pacman.x && current.y === pacman.y) {
            return reconstructPath(cameFrom, current);
        }

        // Otherwise, remove current from openSet
        openSet = openSet.filter(node => !(node.x === current.x && node.y === current.y));
        // Get neighbours of the current node
        let neighbours = getNeighbours(current, ghost);

        // For each neighbor of current
        for (let i = 0; i < neighbours.length; i++) {
            let neighbour = neighbours[i];
            // Calculate tentative gScore
            let tentativeGScore = gScore[`${current.x},${current.y}`] + 1;
            // If this path is better than previous ones, record it
            if (tentativeGScore < gScore[`${neighbour.x},${neighbour.y}`]) {
                cameFrom[`${neighbour.x},${neighbour.y}`] = current;
                gScore[`${neighbour.x},${neighbour.y}`] = tentativeGScore;
                fScore[`${neighbour.x},${neighbour.y}`] = gScore[`${neighbour.x},${neighbour.y}`] + heuristic(neighbour, pacman);
                // If neighbour not in openSet, add it
                if (!openSet.some(node => node.x === neighbour.x && node.y === neighbour.y)) {
                    openSet.push(neighbour);
                }
            }
        }
    }
}

// Heuristic function estimates the cost to reach pacman from node n.
function heuristic(node, pacman) {
    return Math.abs(node.x - pacman.x) + Math.abs(node.y - pacman.y);
}

function getNeighbours(node, ghost) {
    let neighbours = [];
    
    let prevX = ghost.prevX;
    let prevY = ghost.prevY;

    // Check for the wraparound conditions
    if (node.x === 0 && node.y === 14) neighbours.push({ x: 27, y: 14 });
    if (node.x === 27 && node.y === 14) neighbours.push({ x: 0, y: 14 });

    if (node.x - 1 !== prevX || node.y !== prevY) if (isValidMove(node.x - 1, node.y)) neighbours.push({ x: node.x - 1, y: node.y });
    if (node.x + 1 !== prevX || node.y !== prevY) if (isValidMove(node.x + 1, node.y)) neighbours.push({ x: node.x + 1, y: node.y });
    if (node.x !== prevX || node.y - 1 !== prevY) if (isValidMove(node.x, node.y - 1)) neighbours.push({ x: node.x, y: node.y - 1 });
    if (node.x !== prevX || node.y + 1 !== prevY) if (isValidMove(node.x, node.y + 1)) neighbours.push({ x: node.x, y: node.y + 1 });

    return neighbours;
}




// This function will return the shortest path found from ghost to pacman by retracing the path from pacman to ghost
function reconstructPath(cameFrom, current) {
    let totalPath = [current];

    while (`${current.x},${current.y}` in cameFrom) {
        current = cameFrom[`${current.x},${current.y}`];
        totalPath.push(current);
    }

    return totalPath;
}
