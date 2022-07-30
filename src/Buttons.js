import React from "react";

export function Buttons(props) {
  const { lastMoveDisabled, nextLevelDisabled, prevLevelDisabled } = props.data;
  const { handleNextLevelClick, handlePrevLevelClick, handleRestartLevelClick, handleUndoLastMoveClick } = props.handlers;
  return (
    <div id="game-buttons" className="c-flex">
      <button title="Undo last move" style={{transform: "rotateY(180deg)"}} onClick={handleUndoLastMoveClick} disabled={lastMoveDisabled}>&#10162;</button><button title="Previous level" onClick={handlePrevLevelClick} disabled={prevLevelDisabled}>&#8678;</button><button title="Restart level" onClick={handleRestartLevelClick}>&#8635;</button><button title="Next level" onClick={handleNextLevelClick} disabled={nextLevelDisabled}>&#8680;</button>
    </div>
  );
}