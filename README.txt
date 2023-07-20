Overview

This repository contains a Pac-Man game developed in JavaScript and p5.js for visualizing the game elements. The gameplay uses both traditional pathfinding algorithms, such as A* for the ghosts' movement, and more modern methods like reinforcement learning (RL) for an AI agent that controls Pac-Man. The project demonstrates how RL techniques can be used to train an AI agent to play a classic game like Pac-Man.
Features
2D Grid Environment

The game environment is represented as a 2D grid, where each cell can signify an open space, a wall, or game entities (Pac-Man or ghosts). Walls are drawn according to the original game layout, and the positioning of game entities is updated every frame to reflect the current game state.
A* Path-finding Algorithm

To mimic the behavior of ghosts in the original game, each ghost uses the A* path-finding algorithm to track and follow Pac-Man around the game environment. The path is recalculated at each junction point or when a specific number of frames have passed, ensuring that the ghost's movement remains dynamic and adjusts to Pac-Man's current position.
Manual and AI Controls

Pac-Man can be controlled manually using keyboard inputs, allowing the game to be played traditionally. Alternatively, Pac-Man can be controlled by an AI agent that takes actions based on its current understanding of the game environment. This makes it possible to observe the RL process in action.
Reinforcement Learning AI

In the advanced stages of the project, a RL AI agent is implemented to control Pac-Man's movements. This agent learns optimal gameplay strategies through trial-and-error, gradually improving its performance over time. The RL model is trained using a reward system that aligns with the game's scoring rules — positive rewards for eating pellets and fruit, and negative rewards for being caught by a ghost or making invalid moves.
