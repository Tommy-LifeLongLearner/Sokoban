export function resetSavedData() {
  let data = null;
  if(localStorage.sokoban) {
    const { level, reachedLevel, selectedPlayer } = JSON.parse(localStorage.sokoban);
    data = {level, reachedLevel, selectedPlayer};
  }else {
    data = {level: 1, reachedLevel: 1, selectedPlayer: 'boy'};
  }
  // Initialize a template for saving the data, this way
  // I don't need to check if something is missing and then
  // give it an initial value, that's too much unnecessary work
  localStorage.sokoban = JSON.stringify({
    ...data,
    lastMoveDisabled: true,
    moves: 0,
    pushes: 0,
    gameObjects: [],
    gameLastMoves: []
  });
}

export function saveData(name, value) {
  if(!localStorage.sokoban) {
    resetSavedData();
  }
  let sokoban = JSON.parse(localStorage.sokoban);
  sokoban[name] = value;
  localStorage.sokoban = JSON.stringify(sokoban);
  return value; // so it can be used inside a state setter
}

export function getSavedData(name) {
  if(!localStorage.sokoban) {
    resetSavedData();
  }
  return JSON.parse(localStorage.sokoban)[name];
}