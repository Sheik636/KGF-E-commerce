export const createImage = (url)=> new Promise((resolve, reject)=>{

    const image = new Image();

    image.addEventListener("load",()=>resolve(image));
    image.addEventListener("error",(e)=>reject(e));

    // Only set crossOrigin for remote URLs, not data: or blob: URLs
    if (url.startsWith("http")) {
      image.setAttribute("crossOrigin","anonymous");
    }

    image.src= url;
});

const getCroppedImg= async (imageSrc,pixelCrop)=>{
    const image= await createImage(imageSrc);
    const canvas= document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = pixelCrop.width;
    canvas.height= pixelCrop.height;
    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height,
    )
    return new Promise((resolve, reject)=>{
        canvas.toBlob((blob)=>{
            if (!blob) {
                reject(new Error("Failed to create image blob"));
                return;
            }
            resolve(blob)
        }, "image/jpeg")
    })
}

export default getCroppedImg;