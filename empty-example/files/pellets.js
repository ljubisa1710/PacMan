let pellets = []; // Array to store pellet locations
let pelletImage; // The image for the pellet

let powerPellets = [];
let powerPelletImage;

function addPellets(grid) {
    // Iterating over the grid
    for(let i = 0; i < grid.length; i++) {
        for(let j = 0; j < grid[i].length; j++) {
            // Checking if the spot is valid for a pellet
            if(grid[i][j] === 0) {
                // Add the coordinates to the pellets array
                pellets.push({x: i, y: j});
            }
        }
    }

    removePellets();

    powerPellets.push({x: 1, y: 3});
    powerPellets.push({x: 26, y: 3});
    powerPellets.push({x: 1, y: 23});
    powerPellets.push({x: 26, y: 23});
}

function pelletLoadImages() {
  pelletImage = loadImage('pictures/pellet/regular_pellet.png');
  powerPelletImage = loadImage('pictures/pellet/power_pellet.png');
}

function drawPellets() {
  for (let pellet of pellets) {
    image(pelletImage, pellet.x * 20 + 6, pellet.y * 20 + 6, 8, 8);
  }

  for (let pellet of powerPellets) {
    image(powerPelletImage, pellet.x * 20 + 1, pellet.y * 20 + 3, 18, 13);
  }
}

function removePellets() {
  // Array to store the coordinates from where to remove the pellets
  const removeCoords = [
      {start: {x: 9, y: 11}, end: {x: 18, y: 11}},
      {start: {x: 9, y: 11}, end: {x: 9, y: 19}},
      {start: {x: 9, y: 17}, end: {x: 18, y: 17}},
      {start: {x: 18, y: 11}, end: {x: 18, y: 19}},
      {start: {x: 7, y: 14}, end: {x: 8, y: 14}},
      {start: {x: 12, y: 9}, end: {x: 12, y: 10}},
      {start: {x: 19, y: 14}, end: {x: 20, y: 14}},
      {start: {x: 1, y: 3}, end: {x: 1, y: 3}},
      {start: {x: 26, y: 3}, end: {x: 26, y: 3}},
      {start: {x: 1, y: 23}, end: {x: 1, y: 23}},
      {start: {x: 26, y: 23}, end: {x: 26, y: 23}},
      {start: {x: 15, y: 9}, end: {x: 15, y: 10}},
      {start: {x: 11, y: 13}, end: {x: 16, y: 15}},
      {start: {x: 13, y: 12}, end: {x: 14, y: 12}}
  ];

  // Iterate through the coordinates
  for (let coord of removeCoords) {
      // Remove pellets for each range of x and y coordinates
      for (let x = coord.start.x; x <= coord.end.x; x++) {
          for (let y = coord.start.y; y <= coord.end.y; y++) {
              // Iterate through the pellets array
              for (let i = 0; i < pellets.length; i++) {
                  // If a pellet's x and y match the current x and y, remove it
                  if (pellets[i].x === x && pellets[i].y === y) {
                      pellets.splice(i, 1);
                      // Since we've found a match and removed a pellet, we break the loop
                      break;
                  }
              }
          }
      }
  }
}



