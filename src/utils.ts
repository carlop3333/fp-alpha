import Stats from "stats.js";

export function checkForScale(scale: number) {
    if (scale > 19) return false;
    else if (scale < 0.95) return false;
    else return true;
}

export function setupStats(document: Document) {
    const stats = new Stats();
    stats.showPanel(0);
    stats.dom.style.right = "0px";
    stats.dom.style.removeProperty("left");
    document.body.appendChild(stats.dom);
    return stats;
}

export function componentToHex(c: number) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

export async function loadTextures(urls: Array<string>): Promise<HTMLImageElement[]>  {
    return new Promise<HTMLImageElement[]>(async (res) => {
      const imgs = new Array<HTMLImageElement>;
      for await (const url of urls) {
        const img = new Image();
        img.src = url;
        imgs.push(await new Promise<HTMLImageElement>((res) => {
          img.onload = () => {
            res(img);
          }
        }))
      }
      res(imgs);
    })
}