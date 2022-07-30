import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import { createImages} from './utils';
import { Buttons } from "./Buttons";
import { Statistics } from "./Statistics";
import { drawBackground, drawForeground, createLevelObjects, handelMarkedBoxes, undoLastMove, saveData, getSavedData, movePlayer, resetSavedData } from "./levels";

function App() {
  const [images, setImages] = useState(null);
  const [moves, setMoves] = useState(0);
  const [level, setLevel] = useState(1);
  const [reachedLevel, setReachedLevel] = useState(1);
  const [pushes, setPushes] = useState(0);
  const [didImagesLoad, setDidImagesLoad] = useState(false);
  const [isWinner, setIsWinner] = useState(false);
  const [lastMoveDisabled, setLastMoveDisabled] = useState(true);
  const [nextLevelDisabled, setNextLevelDisabled] = useState(true);
  const [prevLevelDisabled, setPrevLevelDisabled] = useState(true);
  const frontCanvas = useRef();
  const backCanvas = useRef();

  // loading saved data only once
  useEffect(() => {
    setMoves(getSavedData("moves"));
    setLevel(getSavedData("level"));
    setPushes(getSavedData("pushes"));
    setLastMoveDisabled(getSavedData("lastMoveDisabled"));
    setReachedLevel(getSavedData("reachedLevel"));
  }, []);

  // loading images only once
  useEffect(() => {
    async function initializeImages() {
      setImages(await createImages());
      setDidImagesLoad(true);
    }

    initializeImages();
  }, []);

  // handling user keypress
  useEffect(() => {
    document.body.onkeyup = function(e) {
      const isArrowKey = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key);
      if(isArrowKey) {
        runGameLogic(e.key);
      }
    };

    return _=> {
      document.body.onkeyup = null;
    }
  }, [level, images]);

  function runGameLogic(key) {
    movePlayer(key, setMoves, setPushes);
    handelMarkedBoxes(level, increaseReachedLevel, setIsWinner);
    drawForeground(frontCanvas, images);
    setLastMoveDisabled(saveData("lastMoveDisabled", false));
  }

  useEffect(() => {
    // render once per level
    if(didImagesLoad) {
      newLevel();
    }
  }, [level, didImagesLoad]);

  useEffect(() => {
    if(isWinner) {
      document.body.onkeyup = null;
      resetSavedData();
    }
  }, [isWinner]);

  function newLevel() {
    console.log("Rendering a new level");
    resetSavedData();
    drawBackground(backCanvas, level, images);
    createLevelObjects(level, images);
    handelMarkedBoxes(level, increaseReachedLevel, setIsWinner);
    drawForeground(frontCanvas, images);
    setPrevLevelDisabled(level === 1);
    setLastMoveDisabled(true);
    setNextLevelDisabled(level === reachedLevel);
  }

  function increaseLevel(isUnreachedLevel) {
    resetSavedData();
    let levelLimit = isUnreachedLevel ? reachedLevel + 1 : reachedLevel;
    isUnreachedLevel && setReachedLevel(prev => saveData("reachedLevel", prev < 15 ? prev + 1 : 15));
    setLevel(prev => saveData("level", level < levelLimit ? prev + 1 : prev));
  }

  function increaseReachedLevel() {
    level === 15 ? setIsWinner(true) : increaseLevel(true);
  }

  function handleNextLevelClick() {
    level < reachedLevel && increaseLevel();
  }

  function handlePrevLevelClick() {
    level > 1 && decreaseLevel();
  }

  function decreaseLevel() {
    resetSavedData();
    setReachedLevel(prev => saveData("reachedLevel", prev));
    setLevel(prev => saveData("level", prev - 1));
  }

  function handleRestartLevelClick() {
    resetSavedData();
    setReachedLevel(prev => saveData("reachedLevel", prev));
    newLevel();
  }

  function handleUndoLastMoveClick() {
    undoLastMove(setMoves, setPushes, setLastMoveDisabled);
    handelMarkedBoxes(level, increaseReachedLevel, setIsWinner);
    drawForeground(frontCanvas, images);
  }

  return (
    <div id="game-container" winner={isWinner ? "yes" : ""}>
      <div id="game-top-bar">
        <Buttons handlers={{handleNextLevelClick, handlePrevLevelClick, handleRestartLevelClick, handleUndoLastMoveClick}} data={{lastMoveDisabled, nextLevelDisabled, prevLevelDisabled}} />
        <Statistics data={{level, moves, pushes}}/>
      </div>
      <canvas ref={backCanvas} width="450" height="450"></canvas>
      <canvas ref={frontCanvas} width="450" height="450"></canvas>
    </div>
  );
}

export default App;