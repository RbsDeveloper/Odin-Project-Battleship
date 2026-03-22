# ⚓ Battleship

> Strategic naval combat — a browser-based Battleship game built as part of [The Odin Project](https://www.theodinproject.com/) curriculum.

![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-f7df1e?style=flat&logo=javascript&logoColor=black)
![CSS](https://img.shields.io/badge/CSS3-Custom_Properties-1572b6?style=flat&logo=css3)
![Jest](https://img.shields.io/badge/Tested_with-Jest-c21325?style=flat&logo=jest)
![Webpack](https://img.shields.io/badge/Bundled_with-Webpack-8dd6f9?style=flat&logo=webpack&logoColor=black)

🎮 **[Play the game live](https://rbsdeveloper.github.io/Odin-Project-Battleship/)**
---

## Introduction

This project is a fully playable browser implementation of the classic Battleship board game. The primary focus of the assignment was **Test Driven Development (TDD)** — writing tests before writing game logic — and separating concerns cleanly across modules. The result is a complete game with two modes, drag-and-drop ship placement, an AI opponent with hunt-and-target logic, sound effects, and a polished naval-themed UI.

---

## Technologies Used

- **Vanilla JavaScript (ES Modules)** — no frameworks, all logic written from scratch
- **CSS3** — custom properties, pseudo-elements, keyframe animations, `::backdrop`
- **HTML5 `<dialog>`** — native modal API for start, settings and winner screens
- **Jest + Babel** — unit testing with `@babel/preset-env` for ESM support
- **Webpack** — module bundling and development server
- **Font Awesome** — iconography
- **Web Audio API** — sound effects via `HTMLAudioElement`
- **HTML5 Drag and Drop API** — ship placement interaction

---

## Features

- **Two game modes** — Player vs Computer and Player vs Player (pass & play)
- **Drag-and-drop ship placement** — ships can be dragged onto the grid or placed by click
- **Placement preview** — valid placements highlight in blue, invalid in red before confirming
- **Random fleet deployment** — one-click randomised placement for both human and computer players
- **AI opponent with hunt-and-target logic** — the computer attacks randomly until it gets a hit, then systematically targets adjacent cells until the ship is sunk
- **Live fleet status panel** — tracks HP for every ship on both sides in real time
- **Accuracy stats** — shot count, hits, misses and accuracy percentage tracked per player
- **Naval comms log** — scrolling message history displaying the last three game events
- **Sound effects** — cannon fire, water splash and ship hit audio
- **Play Again / New Game** — restart with same players or return to the lobby

---

## The Process

### 1. Tests first — game logic core
Following the TDD requirement, the project started with `Ship`, `Gameboard` and `Player` — all written test-first using Jest. Each method had a failing test written before any implementation. This phase established the foundation: ships that track hits and know when they're sunk, a gameboard that validates placements and records attacks, and a player factory that conditionally extends itself with AI behaviour(that AI behavior came later).

### 2. State and UI scaffolding
With the core logic in place, `gameState` was introduced as a central shared object to make data accessible across modules without passing everything as arguments. From there, each screen was built as its own UI module — start, settings, placement, game and winner — constructed entirely with vanilla DOM manipulation and exported through a single barrel file (`ui/index.js`).

### 3. Connecting logic to UI
After the screens existed visually, the game logic was wired to them incrementally — placement validation, attack processing, turn management, win detection. This phase involved the most back-and-forth: the tendency to build too much inside a single module meant several refactors were needed to pull responsibilities apart. `gameController.js` in particular grew too large and was eventually split into `sessionController`, `placementController` and `combatPhase`, each owning a distinct phase of the application.

### 4. Polish and additional features
Once the core game loop was working end-to-end, a second pass added the features that improve the experience without being strictly necessary for the game to function: the naval comms message log, sound effects, the live accuracy stats panel, drag-and-drop ship placement with hover previews, and the computer AI's hunt-and-target behaviour. Each feature was layered on top of the existing architecture rather than requiring structural changes.

---

## What I Learned

- **TDD in practice** — writing tests before implementation forces you to think about the interface of a function before its internals. It also makes refactoring significantly safer.
- **Factory functions vs classes** — understanding when each pattern is appropriate and the subtle bugs that can arise from mixing them (e.g. calling a factory with `new`).
- **Module architecture** — how to separate concerns across files so each module has one clear reason to change, and how circular dependencies can emerge in a phase-based architecture.
- **Async flow control** — managing a turn-based game loop with `async/await` and `Promise`-based delays, including a processing lock (`isProcessingTurn`) to prevent race conditions during animations.
- **Event delegation** — attaching a single listener to a parent rather than each child cell, and using `closest()` to find the intended target.
- **Drag and Drop API** — handling `dragstart`, `dragover`, `dragleave` and `drop` events to build a smooth placement experience with live previews.
- **CSS custom properties as a design system** — defining a consistent token set for colours, typography and spacing that makes the UI easy to maintain and extend.

---

## Potential Improvements

- **Responsive / mobile layout** — the current layout is desktop-first; touch support and a responsive grid would make it playable on mobile devices
- **Smarter AI** — the current hunt-and-target logic could be extended to detect ship orientation after two consecutive hits and continue attacking in that direction
- **Ship sinking visual** — cells occupied by a sunk ship could change appearance to distinguish a fully sunk vessel from individual hits
- **Animations** — entrance/exit transitions between phases would improve the feel of moving from placement to combat
- **Accessibility** — keyboard navigation for ship placement and screen reader support for game events
- **State persistence** — saving game state to `localStorage` so a game can survive a page refresh

---

## How to Run

### Prerequisites
- [Node.js](https://nodejs.org/) v14 or higher
- npm

### Install dependencies
```bash
npm install
```

### Start the development server
```bash
npm run start
```
Then open `http://localhost:8080` in your browser.

### Run tests
```bash
npm test
```

---

## Project Structure

```
src/
├── index.js                  # Entry point
├── gameController.js         # Phase router
├── sessionController.js      # Lobby, settings, new game logic
├── placementController.js    # Ship placement phase
├── combatPhase.js            # Game and winner phase
├── gameState.js              # Shared state and helpers
├── Ship.js                   # Ship class
├── Gameboard.js              # Gameboard factory
├── Player.js                 # Player factory (human + computer AI)
├── playerSetup.js            # Player instantiation
├── events.js                 # DOM event binders
├── messenger.js              # Message log history
├── soundManager.js           # Audio playback
├── utils.js                  # Shared utilities
└── ui/
    ├── index.js              # Barrel export
    ├── screens/              # Full-page screen builders
    ├── components/           # Reusable UI components
    ├── placement/            # Placement-specific UI helpers
    └── uiUtils/              # DOM helpers

tests/
├── Ship.test.js
├── Gameboard.test.js
└── Player.test.js
```

---

*Built as part of [The Odin Project](https://www.theodinproject.com/) — Full Stack JavaScript path.*
