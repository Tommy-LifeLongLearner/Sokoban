import React from "react";
import { images } from "./utils";

export function Players(props) {
  const { playersListHidden } = props.data;
  const { handleCharSelect } = props.handlers;
  // console.log(boy);
  const {boy, pinkGirl, catGirl, hornGirl, princessGirl} = images;
  const charImages = {boy, pinkGirl, catGirl, hornGirl, princessGirl};

  function handleImgClick(e) {
    const isSelect = e.target.nodeName === "IMG";
    if(isSelect) {
      handleCharSelect(e.target.dataset.char);
    }
  }
  
  return (
    <div id="game-players" onClick={handleImgClick} className={playersListHidden ? "hidden" : ""}>
      {Object.keys(charImages).map((image) => <img key={image} src={charImages[image]} data-char={image}/>)}
    </div>
  );
}