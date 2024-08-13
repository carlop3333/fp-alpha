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

export function componentToHex(c: number): string {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

/**
 * @description A string hex to UInt8. Note that assumes # is not in the text
 */
export function hexStrTo8(s: string): Uint8Array {
  const b = new Array<number>;
  for (const part of s.trim().match(/.{2}/g)!) {
    const n = parseInt(part, 16);
    if (isNaN(n)) throw new EvalError("malformed hex code");
    b.push(n);
  }
  return new Uint8Array(b);
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

export function createMaterialSymbol(symbolName: string, size: "little" | "big"): HTMLElement {
  const symbol = document.createElement("i");
  symbol.className = `mso ${size}`;
  symbol.textContent = symbolName;
  return symbol;
}


export function bufferToHexStr(b: Uint8Array): string {
  let s = "";
  if (b.length == 3) {
    for (const part of b) {
      s += componentToHex(part);
    }
    return s;
  } else {
    throw new EvalError("malformed hex code!");
  }
}