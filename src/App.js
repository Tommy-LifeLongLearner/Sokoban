import box from "./img/box.png";
import goldenBox from "./img/golden-box.png";
import tree from "./img/tree.png";
import wall from "./img/wall.png";
import boy from "./img/boy.png";
import grass from "./img/grass.png";
import mark from "./img/mark.png";
import './App.css';
import React, { useState } from 'react';

function App() {
  const [moves, setMoves] = useState(999);
  const [level, setLevel] = useState(999);
  const [pushes, setPushes] = useState(999);

  return (
    <div id="game-container">
      <div id="game-top-bar">
        <div id="game-buttons" className="c-flex">
          <button>&#10162;</button><button>&#8678;</button><button>&#8635;</button><button>&#8680;</button>
        </div>
        <div id="game-statistics" className="c-flex">
          Level: <span style={{marginRight: 10}}>{level}</span> Moves: <span style={{marginRight: 10}}>{moves}</span> Pushes: <span>{pushes}</span>
        </div>
      </div>
      <canvas id="background-canvas" width="450" height="450"></canvas>
      <canvas id="front-canvas" width="450" height="450"></canvas>
    </div>
  );
}

export default App;
