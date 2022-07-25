function createImage(imageSrc) {
  return new Promise((res, rej) => {
    let newImage = new Image();

    newImage.src = imageSrc;
    newImage.onload = function(e) {
      res(newImage);
    };
  });
}

export async function createImages(imagesSrc) {
  // imagesSrc is an object of image names as key and the imported images as value
  const images = {};
  for(let image in imagesSrc) {
    images[image] = await createImage(imagesSrc[image]);
  }
  return images;
}

