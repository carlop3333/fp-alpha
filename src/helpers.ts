import { KonvaEventObject } from "konva/lib/Node";
import { checkForScale, loadTextures } from "./utils";
import { getColor, getServerWorker, getStage } from "./main";
import Konva from "konva";

export function wheel(e: KonvaEventObject<WheelEvent>, handle: Konva.Stage) {
  e.evt.preventDefault();

  const oldScale = handle.scaleX();
  var direction = e.evt.deltaY > 0 ? 1 : -1;
  const scaleBy = 1.05;
  const newScale = direction > 0 ? oldScale / scaleBy : oldScale * scaleBy;
  //applies limit
  if (!checkForScale(newScale)) return;

  const pointer = handle.getPointerPosition();

  const mouse = {
    x: parseFloat(((pointer!.x - handle.x()) / oldScale).toFixed(2)),
    y: parseFloat(((pointer!.y - handle.y()) / oldScale).toFixed(2)),
  };

  if (e.evt.ctrlKey) {
    direction = -direction;
  }

  handle.scale({ x: newScale, y: newScale });
  handle.position({
    x: parseFloat((pointer!.x - mouse.x * newScale).toFixed(2)),
    y: parseFloat((pointer!.y - mouse.y * newScale).toFixed(2)),
  });
}

//nut: a11y ideas

let spray = false;

export function isSpray() {return spray};

export function allyDown(e: KeyboardEvent, handle: Konva.Stage) {
  /* console.debug("allydown"); */
  let canvasScale = handle.getAbsoluteScale()!;
  const scaleBound = 0.22;

  if (e.key === "+") {
    if (!checkForScale(canvasScale.x + scaleBound)) return;
    handle.scale({ x: canvasScale.x + scaleBound, y: canvasScale.y + scaleBound });
  } else if (e.key === "-") {
    if (!checkForScale(canvasScale.x - scaleBound)) return;
    handle.scale({ x: canvasScale.x - scaleBound, y: canvasScale.y - scaleBound });
  } else if (e.shiftKey) {
    handle.draggable(false); 
    spray = true;
  }
}

export function allyUp(e: KeyboardEvent, handle: Konva.Stage) {
  /* console.debug('allyup'); */
  if (e.key === 'Shift') {
    spray = false;
    handle.draggable(true);
  }
}

export function placePixel(x: number, y: number, color: string): void;
export function placePixel(stage: Konva.Stage): void;
export function placePixel(arg1: number | Konva.Stage, arg2?: number, arg3?: string): void {
  function callToServ(x: number, y: number, color: string) {
    getServerWorker().postMessage({type: "pixel", data: {color, x, y}})
  }

  function pix(layer: Konva.Layer, x: number, y: number, color: string) {
    console.debug(`trying to place on: ${x}, ${y}`);
    const pixel = layer.findOne(`.${x}_${y}`);
    if (pixel !== undefined) {
      console.debug(`found pixel on: ${x}, ${y}`); 
      if (pixel.getAttr("fill") == color) return;
      pixel.setAttr("fill", color);
      callToServ(x, y, color);
    } else {
      console.debug(`creating pixel on: ${x}, ${y}`); 
      layer.add(
        new Konva.Rect({ width: 1, height: 1, fill: color, x: x, y: y, name: `${x}_${y}` })
      );
      callToServ(x, y, color);
    }
    layer.cache({pixelRatio: 4});
  }

  if (typeof arg1 === "number" && typeof arg2 === "number") {
    const x = arg1 as number;
    const y = arg2 as number;
    const color = arg3 as string;
    const layer = getStage()
      .getLayers()
      .filter((val) => val.id() == "main")
      .shift() as Konva.Layer;

    //TODO: Fix manual limit (get limit from server)
    if (x >= 0 && x < 512 && y >= 0 && y < 512) {
      pix(layer, x, y, color);
    }
  } else {
    const stage = arg1 as Konva.Stage;
    const color = getColor();
    const layer = stage
      .getLayers()
      .filter((val) => val.id() == "main")
      .shift() as Konva.Layer;
    const pointerPos = stage.getRelativePointerPosition()!;
    //TODO: Again, Fix manual limit (get limit from server)
    if (pointerPos.x > 0 && pointerPos.x < 512 && pointerPos.y > 0 && pointerPos.y < 512) {
      pix(layer, Math.floor(pointerPos.x), Math.floor(pointerPos.y), color);
    }
  }
}

export function canvasReset(this: Window, _e: UIEvent) {
  const s = getStage();
  const x = this.innerWidth / 2 - 256;
  const y = this.innerHeight / 2 - 256;
  s.size({ width: this.innerWidth, height: this.innerHeight })
    .position({ x, y })
    .scale({ x: 1, y: 1 });
}

export function makeClouds(backgroundLayer: Konva.Layer) {
  //yes, sync
  loadTextures(["/cloud1.png", "/cloud2.png", "/cloud3.png", "/cloud4.png"]).then((textures) => {
    for (const texture of textures) {
      const randomX = Math.random() * (175 - -500) + -500;
      const randomY = Math.random() * (740 - -200) + -200;
      const rndOffX = Math.random() * (5 - -20) + -20;
      const rndOffY = Math.random() * (30 - 5) + 5;
      const cloud = new Konva.Image({
        image: texture,
        x: randomX,
        y: randomY,
        width: 95,
        height: 30,
        shadowColor: "#000",
        shadowBlur: 2,
        shadowOpacity: 0.5,
        shadowOffset: { x: rndOffX, y: rndOffY },
      });
      cloud.cache({ imageSmoothingEnabled: true });
      backgroundLayer.add(cloud);
      const op = new Konva.Tween({
        node: cloud,
        opacity: 0.2,
        duration: 0.1,
      });
      cloud.on("pointerover pointerout", ({ type }) => {
        type == "pointerover" ? op.play() : op.reverse();
      });
      //moooove
      //TODO: Should do this as a animation instead?
      new Konva.Tween({
        node: cloud,
        x: randomX + 1500,
        duration: 1500,
      }).play();
    }
  });
}

//* types zone
export type genericData = {type: string, data: object};
export type playerCount = {type: "playerCount", data: {count: number}};
export type pixelPlace = {type: "pixel", data: {color: string, x: number, y: number}};