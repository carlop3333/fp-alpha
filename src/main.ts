import "./styles.css";
import Konva from "konva";
import {
  allyDown,
  canvasReset,
  placePixel,
  makeClouds,
  wheel,
  isSpray,
  allyUp,
  genericData,
  playerCount,
  pixelData,
  errorData,
  adminMsg,
} from "./helpers";
import { createMaterialSymbol, setupStats } from "./utils";
import { colorPicker } from "./menus/picker";
import Timeout = NodeJS.Timeout;
import { Dropdown } from "./menus/dropdown";
import { MenuHandler } from "./menus/menu";
import { launchErrorPage } from "./menus/error";

//* start stats first
const stats = setupStats(document);

//* setup color picker
const picker = new colorPicker(
  document.getElementById("color-block") as HTMLCanvasElement,
  document.getElementById("color-input") as HTMLInputElement,
  document.getElementById("color-label") as HTMLLabelElement
);
picker.setup();

//* Create menu handler
const menu = new MenuHandler(document.body);

//* Create dropdown handler
new Dropdown(
  document.getElementById("dropdown") as HTMLButtonElement,
  document.getElementById("ddwn-content") as HTMLDivElement,
  menu
);

//*get canvas
const canvas = document.querySelector<HTMLDivElement>("#canvas");
//apply legacy background
canvas!.style.transition = "background-color 0.2s cubic-bezier(0.33, 1, 0.68, 1)";
canvas!.style.backgroundColor = "rgb(100, 205, 238)";

//* start canvas
const main = new Konva.Stage({
  container: canvas!,
  width: window.innerWidth,
  height: window.innerHeight,
  draggable: true,
});
const mainLayer = new Konva.Layer({ listening: false, id: "main" });
const backgroundLayer = new Konva.Layer();
//window center
const centerX = window.innerWidth / 2;
const centerY = window.innerHeight / 2;

main.add(mainLayer).add(backgroundLayer);
//pixel background
mainLayer.add(
  //1+ w/h as a fix
  new Konva.Rect({
    width: 511,
    height: 511,
    fill: "#CECECE",
    x: 0,
    y: 0,
    shadowColor: "#000",
    shadowBlur: 5,
    shadowOpacity: 0.5,
    shadowOffset: { x: -10, y: 20 },
  })
);
main.position({ x: centerX - 256, y: centerY - 256 });

//clouds in da background
makeClouds(backgroundLayer);

//get initial batch
fetch("https://backend.foreverplaced.net/initialbatch").then((res) => {
  res.json().then((data) => {
    console.log("Downloaded initial pixel batch.");
    const pixels = new Array<Konva.Rect>();
    for (const pixel of data) {
      const px = mainLayer.findOne(`.${pixel.x}_${pixel.y}`);
      if (px !== undefined) {
        if (px.getAttr("fill") == `#${pixel.color}`) return;
        px.setAttr("fill", `#${pixel.color}`);
      } else {
        pixels.push(
          new Konva.Rect({
            width: 1,
            height: 1,
            fill: `#${pixel.color}`,
            x: parseInt(pixel.x),
            y: parseInt(pixel.y),
            name: `${pixel.x}_${pixel.y}`,
          })
        );
      }
    }
    mainLayer.add(...pixels);
    mainLayer.cache({ pixelRatio: 4 });
  });
});

//* start server connection
const serverInstance = new Worker(new URL("./server.ts", import.meta.url), { type: "module" });
const pCount = document.getElementById("pcount") as HTMLSpanElement;
serverInstance.onmessage = (ev) => {
  const msg = ev.data as genericData;
  switch (msg.type) {
    case "playerCount":
      pCount.innerHTML = ""; //cleans it
      pCount.append(createMaterialSymbol("group", "little"), (msg as playerCount).data.count.toString());
      break;
    case "pixel":
      const pix = (msg as pixelData).data;
      placePixel(pix.x, pix.y, pix.color);
      break;
    case "error":
      launchErrorPage(menu, (msg as errorData).data.code, (msg as errorData).data.reason);
      break;
    case "adminMsg":
      menu.pushNotification(`> Admin global message: ${(msg as adminMsg).data.text}`, 5);
      break;
  }
};

//Event listeners
main.on("wheel", (e) => wheel(e, main));
window.addEventListener("resize", canvasReset);
window.addEventListener("keydown", (e) => allyDown(e, main));
window.addEventListener("keyup", (e) => allyUp(e, main));

main.on("click", () => {
  if (!isSpray()) placePixel(main);
});

var fillId: Timeout | undefined;
main.on("mouseup mousedown", ({ type }) => {
  if (isSpray() && type == "mousedown") {
    fillId = setInterval(() => {
      placePixel(main);
    }, 50);
  }
  if (type == "mouseup") clearInterval(fillId);
});

const abcol = document.getElementById("abcol") as HTMLSpanElement;

main.on("pointermove", () => {
  const absolPos = main.getRelativePointerPosition()!;
  //TODO: Fix manual limit (get limit from server)
  if (absolPos.x > 0 && absolPos.x < 510 && absolPos.y > 0 && absolPos.y < 510) {
    abcol.textContent = `(${Math.floor(absolPos.x).toFixed()},${Math.floor(absolPos.y).toFixed()})`;
  }
});

function mainLoop() {
  stats.begin();

  mainLayer.draw();

  stats.end();
  requestAnimationFrame(mainLoop);
}
//not going to export main and picker fuck that
export function getStage() {
  return main;
}
export function getColor() {
  return picker.color;
}
export function getServerWorker() {
  return serverInstance;
}

requestAnimationFrame(mainLoop);