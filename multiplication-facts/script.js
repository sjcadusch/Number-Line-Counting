const form = document.getElementById("controls");
const factFamilyInput = document.getElementById("factFamily");
const speedInput = document.getElementById("speed");
const orderInput = document.getElementById("order");
const statusEl = document.getElementById("status");
const factsBody = document.getElementById("factsBody");
const pauseBtn = document.getElementById("pause");
const resetBtn = document.getElementById("reset");

let queue = [];
let timer = null;
let isPaused = false;
let index = 0;
let speed = 900;

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildQueue(factFamily, order) {
  const multipliers = [...Array(13)].map((_, i) => i);
  if (order === "backward") {
    multipliers.reverse();
  }

  const list = multipliers.map((multiplier) => ({
    multiplier,
    fact: factFamily,
    product: multiplier * factFamily,
  }));

  return order === "random" ? shuffle(list) : list;
}

function stopTimer() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

function addRow(item) {
  const tr = document.createElement("tr");
  const countCell = document.createElement("td");
  const equationCell = document.createElement("td");

  countCell.textContent = String(index + 1);
  equationCell.textContent = `${item.multiplier} × ${item.fact} = ${item.product}`;

  tr.append(countCell, equationCell);
  factsBody.appendChild(tr);
}

function tick() {
  if (index >= queue.length) {
    stopTimer();
    pauseBtn.textContent = "Pause";
    isPaused = false;
    statusEl.textContent = "Finished! Press Start to play again.";
    return;
  }

  addRow(queue[index]);
  index += 1;
  statusEl.textContent = `Showing ${index} of ${queue.length}`;
}

function startPlayback() {
  stopTimer();
  factsBody.innerHTML = "";
  index = 0;
  isPaused = false;
  pauseBtn.textContent = "Pause";
  tick();
  timer = setInterval(tick, speed);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const factFamily = Number(factFamilyInput.value);
  if (!Number.isInteger(factFamily) || factFamily < 1 || factFamily > 12) {
    statusEl.textContent = "Please enter a whole number fact family from 1 to 12.";
    stopTimer();
    factsBody.innerHTML = "";
    return;
  }

  speed = Math.max(150, Number(speedInput.value) || 900);
  queue = buildQueue(factFamily, orderInput.value);
  startPlayback();
});

pauseBtn.addEventListener("click", () => {
  if (!queue.length) {
    return;
  }

  if (!isPaused) {
    stopTimer();
    isPaused = true;
    pauseBtn.textContent = "Resume";
    statusEl.textContent = "Paused.";
  } else {
    isPaused = false;
    pauseBtn.textContent = "Pause";
    timer = setInterval(tick, speed);
    statusEl.textContent = "Resumed.";
  }
});

resetBtn.addEventListener("click", () => {
  stopTimer();
  queue = [];
  index = 0;
  isPaused = false;
  pauseBtn.textContent = "Pause";
  factsBody.innerHTML = "";
  statusEl.textContent = "Reset complete. Enter a fact family and press Start.";
});
