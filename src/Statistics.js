import React from "react";
import { formatNumber } from "./utils";

export function Statistics(props) {
  const { level, moves, pushes } = props.data;
  return (
    <div id="game-statistics" className="c-flex">
      Level: <span style={{marginRight: 10}}>{formatNumber(level, 2)}</span> Moves: <span style={{marginRight: 10}}>{formatNumber(moves, 4)}</span> Pushes: <span>{formatNumber(pushes, 4)}</span>
    </div>
  );
}