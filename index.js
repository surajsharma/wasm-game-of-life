import { Universe } from "wasm-game-of-life";
import { memory } from "wasm-game-of-life/wasm_game_of_life_bg";

const CELL_SIZE = 10;
const GRID_COLOR = "#000";
const DEAD_COLOR = "#000";
let ALIVE_COLOR = getRandomColor();

const canvas = document.getElementById("game-of-life-canvas");
const reset = document.getElementById("reset");
const play = document.getElementById("toggle");
const autogen = document.getElementById("auto");
const gen = document.getElementById("gen");
const toolbar = document.getElementById("tools");
const stats = document.getElementById("stats");
const loader = document.getElementById("loading");
const ctx = canvas.getContext("2d");

let universe = Universe.new();
let epoch = 1;
let auto = false;

const width = universe.width();
const height = universe.height();

canvas.height = (CELL_SIZE + 1) * height + 1;
canvas.width = (CELL_SIZE + 1) * width + 1;

let running = false;

function getRandomColor(minBrightness = 50) {
  while (true) {
    // Generate random integer representing a color
    const randomColor = Math.floor(Math.random() * 16777215);

    // Ensure 6-character hex string with padding
    const hexColor = "#" + randomColor.toString(16).padStart(6, "0");

    // Convert hex to RGB (ignoring alpha channel)
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    // Calculate normalized brightness (avoiding division by zero)
    const brightness = Math.max((r + g + b) / (255 * 3), 0);

    if (brightness >= minBrightness / 100) {
      return hexColor;
    }
  }
}

function hexToRgba(hexCode, alpha = 1) {
  if (!hexCode || hexCode.length !== 7) {
    throw new Error("Invalid hex code provided.");
  }

  const r = parseInt(hexCode.slice(1, 3), 16);
  const g = parseInt(hexCode.slice(3, 5), 16);
  const b = parseInt(hexCode.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const getIndex = (row, column) => {
  return row * width + column;
};

const drawCells = () => {
  const cellsPtr = universe.cells_ptr();

  // This is updated!
  const cells = new Uint8Array(memory.buffer, cellsPtr, (width * height) / 8);

  ctx.beginPath();

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const idx = getIndex(row, col);

      // This is updated!
      ctx.fillStyle = bitIsSet(idx, cells) ? ALIVE_COLOR : DEAD_COLOR;

      ctx.fillRect(
        col * (CELL_SIZE + 1) + 1,
        row * (CELL_SIZE + 1) + 1,
        CELL_SIZE,
        CELL_SIZE
      );
    }
  }

  ctx.stroke();
};

const drawGrid = () => {
  ctx.beginPath();
  ctx.strokeStyle = GRID_COLOR;

  // Vertical lines.
  for (let i = 0; i <= width; i++) {
    ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
    ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
  }

  // Horizontal lines.
  for (let j = 0; j <= height; j++) {
    ctx.moveTo(0, j * (CELL_SIZE + 1) + 1);
    ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1);
  }

  ctx.stroke();
};

const renderLoop = () => {
  if (universe.get_epoch()) {
    if (auto) {
      reset.click();
      return;
    } else {
      running = false;
      play.innerText = "run";
      updateStatus();
      return;
    }
  }

  if (!running) return;

  universe.tick();
  drawGrid();
  drawCells();
  updateStatus();
  requestAnimationFrame(renderLoop);
};

const bitIsSet = (n, arr) => {
  const byte = Math.floor(n / 8);
  const mask = 1 << n % 8;
  return (arr[byte] & mask) === mask;
};

const updateStatus = () => {
  gen.innerText = "";
  gen.innerText += `Epoch: ${epoch} ${auto ? " [auto-generated]" : ""}\n`;
  gen.innerText += `Generation: ${universe.get_gen()}\n`;
  gen.innerText += running
    ? `[running]`
    : universe.get_epoch()
    ? `[epoch expired]`
    : `[paused]\n`;
};

const pageLoaded = () => {
  if (!stats) return;
  stats.style.position = "relative";
  stats.style.border = "1px solid rgba(50, 50, 50, 0.8)";

  autogen.style.border = "1px solid rgba(225,0,0,0.5)";
  autogen.style.backgroundColor = "rgba(225,0,0,0.2)";
  toolbar.style.backgroundColor = hexToRgba(ALIVE_COLOR, 0.1);

  updateStatus();
  drawGrid();
  drawCells();

  if (loader) loader.style.display = "none";
  requestAnimationFrame(renderLoop);
};

/*******************************************************************************
 * Event Listeners
 *******************************************************************************/

autogen.addEventListener("click", () => {
  auto = !auto;

  updateStatus();
  if (auto) {
    autogen.style.border = "1px solid rgba(0,225,0,0.5)";
    autogen.style.backgroundColor = "rgba(0,225,0,0.2)";
  }

  if (!auto) {
    autogen.style.border = "1px solid rgba(225,0,0,0.5)";
    autogen.style.backgroundColor = "rgba(225,0,0,0.2)";
  }
});

reset.addEventListener("click", () => {
  console.clear();
  console.log("starting new epoch");

  universe = Universe.new();
  epoch += 1;
  ALIVE_COLOR = getRandomColor();

  toolbar.style.backgroundColor = hexToRgba(ALIVE_COLOR, 0.1);
  running = true;
  play.innerText = "pause";
  renderLoop();
});

play.addEventListener("click", () => {
  console.log(process.env);
  if (running) {
    play.innerText = "run";
  }

  if (!running) {
    play.innerText = "pause";
  }

  running = !running;
  renderLoop();
  updateStatus();
});

setTimeout(pageLoaded, 10);
