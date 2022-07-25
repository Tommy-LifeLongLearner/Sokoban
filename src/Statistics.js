import React from "react";

export function Statistics({level, moves, pushes}) {
  return (
    <div id="game-statistics" className="c-flex">
      Level: <span style={{marginRight: 10}}>{level}</span> Moves: <span style={{marginRight: 10}}>{moves}</span> Pushes: <span>{pushes}</span>
    </div>
  );
}