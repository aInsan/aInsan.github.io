let scores = [];

function createTeamElement(i) {
  const teamNum = i + 1;
  const teamDiv = document.createElement("div");
  teamDiv.className = "team";
  teamDiv.id = `team${teamNum}`;

  const nameInput = document.createElement("input");
  nameInput.className = "team-name";
  nameInput.value = `Team ${teamNum}`;

  const scoreInput = document.createElement("input");
  scoreInput.className = "score score-input";
  scoreInput.id = `score${teamNum}`;
  scoreInput.value = scores[i];
  scoreInput.type = "number";
  scoreInput.inputMode = "numeric";
  scoreInput.style.textAlign = "center";

  // when user types a number, update internal scores
  scoreInput.addEventListener("change", () => {
    const val = parseInt(scoreInput.value, 10);
    scores[i] = Number.isFinite(val) ? val : 0;
    scoreInput.value = scores[i];
  });

  const buttons = document.createElement("div");
  buttons.className = "buttons";

  [
    [1, "+1"],
    [10, "+10"],
    [-1, "-1"],
    [-10, "-10"],
  ].forEach(([delta, label]) => {
    const btn = document.createElement("button");
    btn.textContent = label;
    btn.addEventListener("click", () => changeScore(teamNum, delta));
    buttons.appendChild(btn);
  });

  teamDiv.appendChild(nameInput);
  teamDiv.appendChild(scoreInput);
  teamDiv.appendChild(buttons);

  return teamDiv;
}

function renderPlayers(count) {
  const board = document.getElementById("scoreboard");
  board.innerHTML = "";
  scores = new Array(count).fill(0);
  for (let i = 0; i < count; i++) {
    board.appendChild(createTeamElement(i));
  }
}

function changeScore(team, delta) {
  const idx = team - 1;
  if (idx < 0 || idx >= scores.length) return;
  scores[idx] += delta;
  const el = document.getElementById(`score${team}`);
  if (el) el.value = scores[idx];
}

// wire playerCount control
document.addEventListener("DOMContentLoaded", () => {
  const playerCount = document.getElementById("playerCount");
  const initial = Math.max(
    1,
    Math.min(12, parseInt(playerCount.value, 10) || 4)
  );
  renderPlayers(initial);

  playerCount.addEventListener("change", () => {
    let val = parseInt(playerCount.value, 10) || 1;
    val = Math.max(1, Math.min(12, val));
    playerCount.value = val;
    renderPlayers(val);
  });
});
