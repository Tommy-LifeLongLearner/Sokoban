import box from "./img/box.png";
import goldenBox from "./img/golden-box.png";
import tree from "./img/tree.png";
import wall from "./img/wall.png";
import boy from "./img/boy.png";
import grass from "./img/grass.png";
import mark from "./img/mark.png";
import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import { createImages, formatNumber } from './utils';
import { Buttons } from "./Buttons";
import { Statistics } from "./Statistics";
import { drawBackground, drawForeground, createLevelObjects, gameObjects, handelMarkedBoxes } from "./levels";

function App() {
  const [images, setImages] = useState({box, goldenBox, tree, wall, boy, grass, mark});
  const [moves, setMoves] = useState(0);
  const [level, setLevel] = useState(1);
  const [pushes, setPushes] = useState(0);
  const [didImagesLoad, setDidImagesLoad] = useState(false);
  const [isWinner, setIsWinner] = useState(false);
  const [levelRestart, setLevelRestart] = useState(false);
  const frontCanvas = useRef();
  const backCanvas = useRef();

  useEffect(() => {
    document.body.onkeyup = function(e) {
      if(e.keyCode >= 37 && e.keyCode <= 40) {
        const player = gameObjects[0];
        player.move(e.keyCode, setMoves, setPushes);
        handelMarkedBoxes(level, images, increaseLevel, setIsWinner);
        drawForeground(frontCanvas, level, images);
      }
    };
    return _=> {
      document.body.onkeyup = null;
    }
  }, [level, images]);

  useEffect(() => {
    async function initializeImages() {
      setImages(await createImages(images));
      setDidImagesLoad(true);
    }

    initializeImages();
  }, [images]);

  useEffect(() => {
    // render once per level
    if(didImagesLoad) {
      setMoves(0);
      setPushes(0);
      drawBackground(backCanvas, level, images);
      createLevelObjects(level, images);
      handelMarkedBoxes(level, images, increaseLevel, setIsWinner);
      drawForeground(frontCanvas, level, images);
    }

    if(isWinner) {
      document.body.onkeyup = null;
    }
  }, [level, didImagesLoad, images, isWinner, levelRestart]);

  function increaseLevel() {
    setLevel(prev => prev < 15 ? prev + 1 : 1);
  }

  function decreaseLevel() {
    setLevel(prev => prev > 1 ? prev - 1 : 15);
  }

  function restartLevel() {
    setLevelRestart(prev => !prev);
  }

  return (
    <div id="game-container" winner={isWinner ? "yes" : ""}>
      <div id="game-top-bar">
        <Buttons increaseLevel={increaseLevel} decreaseLevel={decreaseLevel} restartLevel={restartLevel}/>
        <Statistics level={formatNumber(level)} moves={formatNumber(moves)} pushes={formatNumber(pushes)}/>
      </div>
      <canvas ref={backCanvas} width="450" height="450"></canvas>
      <canvas ref={frontCanvas} width="450" height="450"></canvas>
    </div>
  );
}

export default App;