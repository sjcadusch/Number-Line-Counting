const factCheckboxes = document.getElementById("factCheckboxes");
const form = document.getElementById("controls");
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

function buildCheckboxes() {
  for (let fact = 1; fact <= 12; fact += 1) {
    const label = document.createElement("label");
    label.className = "fact-option";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.value = String(fact);
    input.checked = fact === 2;

    const text = document.createElement("span");
    text.textContent = String(fact);

    label.append(input, text);
    factCheckboxes.appendChild(label);
  }
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getSelectedFacts() {
  return [...factCheckboxes.querySelectorAll("input:checked")].map((node) => Number(node.value));
}

function buildQueue(selectedFacts, order) {
  const multipliers = [...Array(13)].map((_, i) => i);
  if (order === "backward") {
    multipliers.reverse();
  }

  const list = [];
  selectedFacts.forEach((fact) => {
    multipliers.forEach((multiplier) => {
      list.push({
        multiplier,
        fact,
        product: multiplier * fact,
      });
    });
  });

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
  tr.scrollIntoView({ behavior: "smooth", block: "end" });
}

function tick() {
  if (index >= queue.length) {
    stopTimer();
    pauseBtn.textContent = "Pause";
    isPaused = false;
    statusEl.textContent = "Finished! Press Start to play again.";
    return;
  }

  const item = queue[index];
  addRow(item);
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

  const selectedFacts = getSelectedFacts();
  if (!selectedFacts.length) {
    statusEl.textContent = "Please select at least one fact family from 1 to 12.";
    stopTimer();
    factsBody.innerHTML = "";
    return;
  }

  speed = Math.max(150, Number(speedInput.value) || 900);
  queue = buildQueue(selectedFacts, orderInput.value);

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
  statusEl.textContent = "Reset complete. Select facts and press Start.";
});

buildCheckboxes();
