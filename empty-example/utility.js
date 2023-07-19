// Function to draw the grid
function drawGrid() {
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j] === 1) {
          fill(0); // Black for walls
        } else {
          fill(255); // White for empty space
        }
        rect(i * 20, j * 20, 20, 20);
      }
    }
  }

// Function to find junctions on the grid
function findJunctions() {
    allowedUpdatePositions = []; // Clear the allowed update positions array

    // Iterate through the grid
    for (let x = 0; x < grid.length; x++) {
        for (let y = 0; y < grid[x].length; y++) {
        if (isJunction(x, y)) {
            allowedUpdatePositions.push({ x, y }); // Add junction coordinates to the allowed update positions array
        }
        }
    }
}

// Function to check if a given position is a junction
function isJunction(x, y) {
    if (grid[x][y] === 1) {
        return false; // Not a valid position
    }

    let adjacentPaths = 0; // Counter for adjacent paths

    // Check adjacent positions for paths
    if (isWithinGrid(x-1, y) && isNotWall(x-1, y)) {
        adjacentPaths++;
    }
    if (isWithinGrid(x+1, y) && isNotWall(x+1, y)) {
        adjacentPaths++;
    }
    if (isWithinGrid(x, y-1) && isNotWall(x, y-1)) {
        adjacentPaths++;
    }
    if (isWithinGrid(x, y+1) && isNotWall(x, y+1)) {
        adjacentPaths++;
    }

    if (adjacentPaths >= 3) {
        return true;
    } else if (adjacentPaths < 2) {
        return false;
    }

    if (adjacentPaths == 2) {
        let straight = false;

        if (isWithinGrid(x-1, y) && isNotWall(x-1, y)) {
            if (isWithinGrid(x+1, y) && isNotWall(x+1, y)) {
                straight = true;
            }
        }

        if (isWithinGrid(x, y-1) && isNotWall(x, y-1)) {
            if (isWithinGrid(x, y+1) && isNotWall(x, y+1)) {
                straight = true;
            }
        }

        if (straight) {
            return false;
        } else {
            return true;
        }
    }
}

// Function to check if a move is valid (not a wall)
function isNotWall(x, y) {
    return grid[x][y] !== 1;
}

// Function to check if a position is valid (within the grid boundaries)
function isWithinGrid(x, y) {
    return x >= 0 && x < grid.length && y >= 0 && y < grid[x].length;
}

// Function to add walls to the grid
function addWallSection(x1, x2, y1, y2, mirror) {
    for (let i = x1; i <= x2; i++) {
        for (let j = y1; j <= y2; j++) {
            grid[i][j] = 1;
            if (mirror == true) {
                grid[27 - i][j] = 1; // Add mirrored walls if mirror is true
            }
        }
    }
}

// Function to add the layout of walls to the grid
function addWalls() {
    // Add walls around the edge of the grid
    for (let i = 0; i < 27; i++) {
      grid[i][0] = 1;
      grid[i][30] = 1;
    }
    for (let i = 0; i < 31; i++) {
      grid[0][i] = 1;
      grid[27][i] = 1;
    }

    addWallSection(10, 17, 6, 7, false);
    addWallSection(13, 14, 1, 4, false);
    addWallSection(13, 14, 8, 10, false);
    addWallSection(9, 11, 9, 10, true);
    addWallSection(7, 8, 6, 13, true);
    addWallSection(2, 5, 6, 7, true);
    addWallSection(2, 5, 2, 4, true);
    addWallSection(7, 11, 2, 4, true);
    addWallSection(1, 5, 9, 13, true);
    addWallSection(1, 5, 15, 19, true);
    addWallSection(10, 17, 12, 16, true);
    addWallSection(7, 8, 15, 19, true);
    addWallSection(10, 17, 18, 19, false);
    addWallSection(13, 14, 20, 22, false);
    addWallSection(2, 5, 21, 22, true);
    addWallSection(7, 11, 21, 22, true);
    addWallSection(4, 5, 23, 25, true);
    addWallSection(1, 2, 24, 25, true);
    addWallSection(7, 8, 24 ,26, true);
    addWallSection(2, 11, 27, 28, true);
    addWallSection(10, 17, 24, 25, false);
    addWallSection(13, 14, 26, 28, true);
}