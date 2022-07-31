import React from "react";

export function Menu(props) {
  const { settingsHidden } = props.data;
  const { handleMenuItemClick } = props.handlers;
  return (
    <ul id="game-menu" className={settingsHidden ? "hidden" : ""} onClick={handleMenuItemClick} >
      <li>Change Player</li>
      <li>Custom Game</li>
    </ul>
  );
}