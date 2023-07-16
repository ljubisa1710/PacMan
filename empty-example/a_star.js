// A* algorithm to find the shortest path
function aStar(start, goal) {
    // Initialize necessary arrays and objects
    let openSet = [start];
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

    // The cost of the start position is 0
    gScore[`${start.x},${start.y}`] = 0;
    // For the start node, the fScore is completely heuristic
    fScore[`${start.x},${start.y}`] = heuristic(start, goal);

    // While there are still nodes to evaluate
    while (openSet.length > 0) {
        // Get the node in openSet having the lowest fScore[] value
        let current = openSet.reduce((a, b) => fScore[`${a.x},${a.y}`] < fScore[`${b.x},${b.y}`] ? a : b);

        // If the current node is the goal, then we are done
        if (current.x === goal.x && current.y === goal.y) {
            return reconstructPath(cameFrom, current);
        }

        // Otherwise, remove current from openSet
        openSet = openSet.filter(node => !(node.x === current.x && node.y === current.y));
        // Get neighbours of the current node
        let neighbours = getNeighbours(current);

        // For each neighbor of current
        for (let i = 0; i < neighbours.length; i++) {
            let neighbour = neighbours[i];
            // Calculate tentative gScore
            let tentativeGScore = gScore[`${current.x},${current.y}`] + 1;
            // If this path is better than previous ones, record it
            if (tentativeGScore < gScore[`${neighbour.x},${neighbour.y}`]) {
                cameFrom[`${neighbour.x},${neighbour.y}`] = current;
                gScore[`${neighbour.x},${neighbour.y}`] = tentativeGScore;
                fScore[`${neighbour.x},${neighbour.y}`] = gScore[`${neighbour.x},${neighbour.y}`] + heuristic(neighbour, goal);
                // If neighbour not in openSet, add it
                if (!openSet.some(node => node.x === neighbour.x && node.y === neighbour.y)) {
                    openSet.push(neighbour);
                }
            }
        }
    }
}

// Heuristic function estimates the cost to reach goal from node n.
function heuristic(node, goal) {
    return Math.abs(node.x - goal.x) + Math.abs(node.y - goal.y);
}

// This function will return an array of all the valid neighbours (up, down, left, right) of a given node
function getNeighbours(node) {
    let neighbours = [];
    
    if (grid[node.x - 1][node.y] !== 1) neighbours.push({ x: node.x - 1, y: node.y });
    if (grid[node.x + 1][node.y] !== 1) neighbours.push({ x: node.x + 1, y: node.y });
    if (grid[node.x][node.y - 1] !== 1) neighbours.push({ x: node.x, y: node.y - 1 });
    if (grid[node.x][node.y + 1] !== 1) neighbours.push({ x: node.x, y: node.y + 1 });
    
    return neighbours;
}

// This function will return the shortest path found from start to goal by retracing the path from goal to start
function reconstructPath(cameFrom, current) {
    let totalPath = [current];

    while (`${current.x},${current.y}` in cameFrom) {
        current = cameFrom[`${current.x},${current.y}`];
        totalPath.push(current);
    }

    return totalPath;
}
