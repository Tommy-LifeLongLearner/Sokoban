import { gameLevels } from "./levels";
import { saveData, getSavedData } from './storage';

export const gameObjects = [];
export const gameLastMoves = [];
export const settings = {
  selectedPlayer: "boy"
};

class Block {
  constructor(xb, yb, unit) {
    this.x = xb * 50;
    this.y = yb * 50;
    this.unit = unit;
  }

  draw(canvas, images) {
    //boy image needs custom coords and image
    if(this.unit === "boy") {
      console.log(settings.selectedPlayer);
      canvas.current.getContext("2d").drawImage(images[settings.selectedPlayer], this.x - 5, this.y - 20, 60, 80);
    }else {
      canvas.current.getContext("2d").drawImage(images[this.unit], this.x, this.y, 50, 50);
    }
  }

  move(direction, setMoves, setPushes) {
    const coords = {"left": [-50,0], "right": [50,0], "up": [0,-50], "down": [0,50]};
    direction = direction.slice(5).toLowerCase(); // extract direction from event.key
    handleBlockMove.call(this, direction, coords[direction], setMoves, setPushes);
    saveData("gameObjects", gameObjects);
    saveData("gameLastMoves", gameLastMoves);
  }

  //return the siblings from the four sides left, right, up and down
  getSiblings() {
    const self = this, siblings = {left: 0, right: 0, up: 0, down: 0};
    gameObjects.forEach(unit => {
      if(self.x - unit.x === 50 && self.y - unit.y === 0) {
        siblings.left = unit;
      }else if(self.x - unit.x === -50 && self.y - unit.y === 0) {
        siblings.right = unit;
      }else if(self.y - unit.y === 50 && self.x - unit.x === 0) {
        siblings.up = unit;
      }else if(self.y - unit.y === -50 && self.x - unit.x === 0) {
        siblings.down = unit;
      }
    });
    return siblings;
  }
}

function handleLastMove(lastMove) {
  // store up to 100 previous moves
  if(gameLastMoves.length === 100) {
    gameLastMoves.shift();
  }
  gameLastMoves.push(lastMove);
}

function handleBlockMove(direction, moveCoords, setMoves, setPushes) {
  const nextSibling = this.getSiblings()[direction];
  
  if(nextSibling === 0) {
    this.x += moveCoords[0];
    this.y += moveCoords[1];
    setMoves(prev => saveData("moves", prev + 1));
    handleLastMove (
      {
        coords: {x: moveCoords[0], y: moveCoords[1]},
        box: null
      }
    );
  }else if(nextSibling.unit !== "wall") {
    const secondNextSibling = nextSibling.getSiblings()[direction];
    if(this.unit === "boy" && (nextSibling.unit === "box" || nextSibling.unit === "goldenBox") && secondNextSibling.unit !== "box" && secondNextSibling.unit !== "goldenBox" && secondNextSibling.unit !== "wall") {
      nextSibling.x += moveCoords[0];
      nextSibling.y += moveCoords[1];
      setPushes(prev => saveData("pushes", prev + 1));
      this.x += moveCoords[0];
      this.y += moveCoords[1];
      setMoves(prev => saveData("moves", prev + 1));
      handleLastMove(
        {
          coords: {x: moveCoords[0], y: moveCoords[1]},
          box: nextSibling,
          boxIndex: gameObjects.indexOf(nextSibling)
        }
      );
    }
  }
}



function createWallObjects(level, images) {
  for(var i = 0;i < 9;i++) {
    for(var j = 0;j < 9;j++) {
      if(gameLevels[level - 1].background[i][j] === 'w') {
        gameObjects.push(new Block(j, i, "wall"));
      }
    }
  }
}

function createBoxObjects(level, images) {
  for(var i = 0;i < gameLevels[level - 1].boxes.length;i++) {
    const box = gameLevels[level - 1].boxes[i];
    gameObjects.push(new Block(box[0], box[1], "box"));
  }
}

export function handelMarkedBoxes(level, increaseReachedLevel) {
  let markedBoxes = 0;
  gameObjects.forEach(function(obj) {
    if(obj.unit === "box" || obj.unit === "goldenBox") {
      obj.unit = "box";
      gameLevels[level - 1].marks.forEach(function(mark) {
        if(mark[0] === obj.x / 50 && mark[1] === obj.y / 50) {
          obj.unit = "goldenBox";
          markedBoxes++;
        }
      });
    }
  });


  if(markedBoxes === gameLevels[level - 1].marks.length) {
    document.body.onkeyup = null;
    setTimeout(function() {
      increaseReachedLevel();
    }, 500);
  }
}

function recreateSavedObjects() {
  let gameObjects = getSavedData("gameObjects");
  return gameObjects.map(({x, y, unit}) => new Block(x / 50, y / 50, unit));
}

export function createLevelObjects(level, images) {
  gameLastMoves.splice(0, gameLastMoves.length, ...getSavedData("gameLastMoves"));
  gameObjects.splice(0, gameObjects.length, ...recreateSavedObjects());
  console.log(gameLastMoves, gameObjects);
  const player = gameLevels[level - 1].player;
  if(gameObjects.length === 0) {
    gameObjects.push(new Block(player[0], player[1], "boy"));
    createWallObjects(level, images);
    createBoxObjects(level, images);
  }
}

export function undoLastMove(setMoves, setPushes, setLastMoveDisabled) {
  if(gameLastMoves.length === 0) {
    return;
  }
  let gameLastMove = gameLastMoves.pop();
  const player = gameObjects[0];
  player.x -= gameLastMove.coords.x;
  player.y -= gameLastMove.coords.y;
  setMoves(prev => saveData("moves", prev - 1));
  if(gameLastMove.box) {
    let box = gameObjects[gameLastMove.boxIndex];
    box.x -= gameLastMove.coords.x;
    box.y -= gameLastMove.coords.y;
    setPushes(prev => saveData("pushes", prev - 1));
  }
  if(gameLastMoves.length === 0) {
    setLastMoveDisabled(saveData("lastMoveDisabled", true));
  }
  saveData("gameObjects", gameObjects);
}

export function movePlayer(keyCode, setMoves, setPushes) {
  const player = gameObjects[0];
  player.move(keyCode, setMoves, setPushes);
}

export function changePlayer(charName) {
  settings.selectedPlayer =  saveData("selectedPlayer", charName);
}