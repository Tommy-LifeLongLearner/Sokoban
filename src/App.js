import box from "./img/box.png";
import goldenBox from "./img/golden-box.png";
import tree from "./img/tree.png";
import wall from "./img/wall.png";
import boy from "./img/boy.png";
import grass from "./img/grass.png";
import mark from "./img/mark.png";
import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import { createImages } from './utils';
import { Buttons } from "./Buttons";
import { Statistics } from "./Statistics";

function App() {
  const [images, setImages] = useState({box, goldenBox, tree, wall, boy, grass, mark});
  const [moves, setMoves] = useState(999);
  const [level, setLevel] = useState(999);
  const [pushes, setPushes] = useState(999);
  const [didImagesLoad, setDidImagesLoad] = useState(false);
  const frontCanvas = useRef();
  const backCanvas = useRef();

  useEffect(() => {
    async function initializeImages() {
      console.log("getting images");
      setImages(await createImages(images));
      console.log(images);
      setDidImagesLoad(true);
    }

    initializeImages();
  }, [images]);

  useEffect(() => {
    console.log("loaded images", didImagesLoad);
    console.log(images);
    if(didImagesLoad) {
      frontCanvas.current.getContext("2d").drawImage(images.boy, -5, -25, 60, 80);
      backCanvas.current.getContext("2d").drawImage(images.box, -5, -25, 60, 80);
      setLevel(1);
      setMoves(0);
      setPushes(0);
    }
  }, [didImagesLoad, images]);

  // function draw() {
  //   if(didImagesLoad) {
  //     // frontCtx.drawImage(images.boy, -5, -25, 60, 80);
  //     console.log(images);

  //   }
  // }

  return (
    <div id="game-container">
      <div id="game-top-bar">
        <Buttons />
        <Statistics level={level} moves={moves} pushes={pushes}/>
      </div>
      <canvas ref={backCanvas} width="450" height="450"></canvas>
      <canvas ref={frontCanvas} width="450" height="450"></canvas>
    </div>
  );
}

export default App;