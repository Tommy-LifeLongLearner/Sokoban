import React from "react";

export function Buttons({increaseLevel, decreaseLevel, restartLevel, undoLastMove, lastMoveDisabled}) {
  return (
    <div id="game-buttons" className="c-flex">
      <button title="Undo last move" style={{transform: "rotateY(180deg)"}} onClick={undoLastMove} disabled={lastMoveDisabled}>&#10162;</button><button title="Previous level" onClick={decreaseLevel}>&#8678;</button><button title="Restart level" onClick={restartLevel}>&#8635;</button><button title="Next level" onClick={increaseLevel}>&#8680;</button>
    </div>
  );
}