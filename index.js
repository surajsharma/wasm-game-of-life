import { Universe, Cell } from "wasm-game-of-life";
import { memory } from "wasm-game-of-life/wasm_game_of_life_bg";

const CELL_SIZE = 100;
const GRID_COLOR = "#000";
const DEAD_COLOR = "#000";
const ALIVE_COLOR = "#0f0";

const canvas = document.getElementById("game-of-life-canvas");
const reset = document.getElementById("reset");
const play = document.getElementById("toggle");
const gen = document.getElementById("gen");
const ctx = canvas.getContext("2d");

let universe = Universe.new();
const width = universe.width();
const height = universe.height();

canvas.height = (CELL_SIZE + 1) * height + 1;
canvas.width = (CELL_SIZE + 1) * width + 1;

let running = false;

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

reset.addEventListener("click", () => {
  console.clear();
  console.log("starting new epoch");
  universe = Universe.new();
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
});

const renderLoop = () => {
  if (universe.get_epoch()) {
    running = false;
    play.innerText = "run";
    gen.innerText = `Generation: ${universe.get_gen()}\nEpoch Expired.\nStart a new epoch by clicking reset.`;
    return;
  }

  if (!running) return;

  universe.tick();
  drawGrid();
  drawCells();

  gen.innerText = `Generation: ${universe.get_gen()}`;
  requestAnimationFrame(renderLoop);
};

const bitIsSet = (n, arr) => {
  const byte = Math.floor(n / 8);
  const mask = 1 << n % 8;
  return (arr[byte] & mask) === mask;
};

window.addEventListener("load", (e) => {
  gen.innerText = "Click run to start.";
});

drawGrid();
drawCells();
requestAnimationFrame(renderLoop);
