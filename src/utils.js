import box from "./img/box.png";
import goldenBox from "./img/golden-box.png";
import tree from "./img/tree.png";
import wall from "./img/wall.png";
import boy from "./img/boy.png";
import grass from "./img/grass.png";
import mark from "./img/mark.png";

function createImage(imageSrc) {
  return new Promise((res, rej) => {
    let newImage = new Image();

    newImage.src = imageSrc;
    newImage.onload = function(e) {
      res(newImage);
    };
  });
}

export async function createImages() {
  const images = {box, goldenBox, tree, wall, boy, grass, mark};
  // imagesSrc is an object of image names as key and the imported images as value
  for(let image in images) {
    images[image] = await createImage(images[image]);
  }
  return images;
}

export function formatNumber(number, ext) {
  return "0".repeat(ext - number.toString().length) + number;
}

