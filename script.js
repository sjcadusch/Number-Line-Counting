const PIXELS_PER_MAJOR = 160;
const SIDE_PADDING = 56;
const EPSILON = 1e-9;

const form = document.getElementById("controls");
const startInput = document.getElementById("start");
const endInput = document.getElementById("end");
const majorStepInput = document.getElementById("majorStep");
const minorDivisionsSelect = document.getElementById("minorDivisions");
const statusEl = document.getElementById("status");
const viewport = document.getElementById("viewport");
const track = document.getElementById("track");

function formatNumber(value) {
  if (Math.abs(value) < EPSILON) {
    return "0";
  }

  const rounded = Math.round(value * 1000) / 1000;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(3).replace(/\.?0+$/, "");
}

function divisionName(count) {
  return { 2: "halves", 5: "fifths", 10: "tenths" }[count] ?? `${count} parts`;
}

function createDiv(className, styles = {}, textContent = "") {
  const element = document.createElement("div");
  element.className = className;
  Object.assign(element.style, styles);
  if (textContent) {
    element.textContent = textContent;
  }
  return element;
}

function renderNumberLine(start, end, majorStep, minorDivisions) {
  const minValue = Math.min(start, end);
  const maxValue = Math.max(start, end);
  const displayMin = minValue - majorStep;
  const displayMax = maxValue + majorStep;
  const totalMajorSegments = (displayMax - displayMin) / majorStep;
  const minorStep = majorStep / minorDivisions;
  const width = totalMajorSegments * PIXELS_PER_MAJOR + SIDE_PADDING * 2;
  const baselineY = 170;

  track.innerHTML = "";
  track.style.width = `${width}px`;

  const baseline = createDiv("baseline", {
    left: `${SIDE_PADDING}px`,
    width: `${width - SIDE_PADDING * 2}px`,
    top: `${baselineY}px`,
  });
  track.appendChild(baseline);

  const leftArrow = createDiv("arrow arrow-left", { left: `${SIDE_PADDING - 2}px`, top: `${baselineY - 8}px` });
  const rightArrow = createDiv("arrow arrow-right", { left: `${width - SIDE_PADDING - 14}px`, top: `${baselineY - 8}px` });
  track.append(leftArrow, rightArrow);

  for (let value = displayMin; value <= displayMax + EPSILON; value += minorStep) {
    const normalizedValue = Math.round(value / minorStep) * minorStep;
    const offset = ((normalizedValue - displayMin) / majorStep) * PIXELS_PER_MAJOR + SIDE_PADDING;
    const majorIndex = (normalizedValue - displayMin) / majorStep;
    const isMajorTick = Math.abs(majorIndex - Math.round(majorIndex)) < 1e-7;
    const tick = createDiv(isMajorTick ? "tick major" : "tick minor", { left: `${offset}px` });
    track.appendChild(tick);

    if (isMajorTick) {
      const isWithinLabelRange = normalizedValue >= minValue - EPSILON && normalizedValue <= maxValue + EPSILON;
      if (isWithinLabelRange) {
        const label = createDiv("label", { left: `${offset}px` }, formatNumber(normalizedValue));
        track.appendChild(label);
      }
    }
  }

  const zeroInRange = displayMin <= 0 && displayMax >= 0;
  if (zeroInRange) {
    const zeroOffset = ((0 - displayMin) / majorStep) * PIXELS_PER_MAJOR + SIDE_PADDING;
    const zeroMarker = createDiv("zero-marker", { left: `${zeroOffset}px` });
    track.appendChild(zeroMarker);
  }

  statusEl.textContent = `Showing ${formatNumber(minValue)} to ${formatNumber(maxValue)} with major divisions of ${formatNumber(majorStep)} and minor ${divisionName(minorDivisions)}.`;

  requestAnimationFrame(() => {
    const startOffset = ((minValue - displayMin) / majorStep) * PIXELS_PER_MAJOR;
    const centerTarget = Math.max(0, startOffset + SIDE_PADDING - viewport.clientWidth / 2);
    viewport.scrollTo({ left: centerTarget, behavior: "smooth" });
  });
}

function handleSubmit(event) {
  event.preventDefault();

  const start = Number(startInput.value);
  const end = Number(endInput.value);
  const majorStep = Number(majorStepInput.value);
  const minorDivisions = Number(minorDivisionsSelect.value);

  if (!Number.isFinite(start) || !Number.isFinite(end) || !Number.isFinite(majorStep) || majorStep <= 0) {
    statusEl.textContent = "Please enter valid numbers, and make sure the major division is greater than zero.";
    return;
  }

  renderNumberLine(start, end, majorStep, minorDivisions);
}

form.addEventListener("submit", handleSubmit);
renderNumberLine(Number(startInput.value), Number(endInput.value), Number(majorStepInput.value), Number(minorDivisionsSelect.value));
