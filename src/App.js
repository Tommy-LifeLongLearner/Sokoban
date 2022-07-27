import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import { createImages, formatNumber } from './utils';
import { Buttons } from "./Buttons";
import { Statistics } from "./Statistics";
import { drawBackground, drawForeground, createLevelObjects, handelMarkedBoxes, undoLastMove, saveData, getSavedData, movePlayer, resetSavedData } from "./levels";

function App() {
  const [images, setImages] = useState(null);
  const [moves, setMoves] = useState(0);
  const [level, setLevel] = useState(1);
  const [pushes, setPushes] = useState(0);
  const [didImagesLoad, setDidImagesLoad] = useState(false);
  const [isWinner, setIsWinner] = useState();
  const [levelRestart, setLevelRestart] = useState(false);
  const [lastMoveDisabled, setLastMoveDisabled] = useState();
  const frontCanvas = useRef();
  const backCanvas = useRef();

  // handling user keypress
  useEffect(() => {
    document.body.onkeyup = function(e) {
      const isArrowKey = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key);
      if(isArrowKey) {
        movePlayer(e.key, setMoves, setPushes);
        handelMarkedBoxes(level, images, increaseLevel, setIsWinner);
        drawForeground(frontCanvas, images);
        setLastMoveDisabled(saveData("lastMoveDisabled", false));
      }
    };

    return _=> {
      document.body.onkeyup = null;
    }
  }, [level, images]);

  // loading images
  useEffect(() => {
    async function initializeImages() {
      setImages(await createImages());
      setDidImagesLoad(true);
    }

    initializeImages();
  }, []);

  useEffect(() => {
    setMoves(getSavedData("moves"));
    setLevel(getSavedData("level"));
    setPushes(getSavedData("pushes"));
    setLastMoveDisabled(getSavedData("lastMoveDisabled"));
  }, [level]);

  useEffect(() => {
    if(isWinner) {
      document.body.onkeyup = null;
    }
  }, [isWinner]);

  useEffect(() => {
    // render once per level
    if(didImagesLoad) {
      drawBackground(backCanvas, level, images);
      createLevelObjects(level, images);
      handelMarkedBoxes(level, images, increaseLevel, setIsWinner);
      drawForeground(frontCanvas, images);
    }
  }, [level, didImagesLoad, images, levelRestart]);

  function increaseLevel() {
    resetSavedData();
    setLevel(prev => saveData("level", prev < 15 ? prev + 1 : 1));
  }

  function decreaseLevel() {
    resetSavedData();
    setLevel(prev => saveData("level", prev > 1 ? prev - 1 : 15));
  }

  function restartLevel() {
    resetSavedData();
    setLevelRestart(prev => !prev);
  }

  function undoLastMoveHandler() {
    undoLastMove(setMoves, setPushes, setLastMoveDisabled);
    handelMarkedBoxes(level, images, increaseLevel, setIsWinner);
    drawForeground(frontCanvas, images);
  }

  return (
    <div id="game-container" winner={isWinner ? "yes" : ""}>
      <div id="game-top-bar">
        <Buttons increaseLevel={increaseLevel} decreaseLevel={decreaseLevel} restartLevel={restartLevel} undoLastMove={undoLastMoveHandler} lastMoveDisabled={lastMoveDisabled}/>
        <Statistics level={formatNumber(level)} moves={formatNumber(moves)} pushes={formatNumber(pushes)}/>
      </div>
      <canvas ref={backCanvas} width="450" height="450"></canvas>
      <canvas ref={frontCanvas} width="450" height="450"></canvas>
    </div>
  );
}

export default App;