import { gameLevels } from "./levels";
import { gameObjects } from "./logic";

function drawMarks(canvas, level, images) {
  const marksCount = gameLevels[level - 1].marks.length;
  for(var i = 0;i < marksCount;i++) {
    let marks = gameLevels[level - 1].marks[i];
    canvas.current.getContext("2d").drawImage(images.mark, marks[0] * 50, marks[1] * 50, 50, 50);
  }
}

export function drawBackground(canvas, level, images) {
  for(var i = 0;i < 9;i++) {
    for(var j = 0;j < 9;j++) {
      let imageSymbol = gameLevels[level - 1].background[i][j];
      let currentImage = {t: images.tree, w: images.wall, g: images.grass}[imageSymbol];
      canvas.current.getContext("2d").drawImage(currentImage, j * 50, i * 50, 50, 50);
    }
  }
  drawMarks(canvas, level, images);
}

export function drawForeground(canvas, images) {
  canvas.current.getContext("2d").clearRect(0, 0, 450, 450);
  gameObjects.forEach(function(unit) {
    unit.draw(canvas, images);
  });
}
