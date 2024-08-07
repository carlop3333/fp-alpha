import { genericData, pixelPlace } from "./helpers";
import { bufferToHexStr, hexStrTo8 } from "./utils";

console.log("Connecting to server...");

const server = new WebSocket(new URL("https://backend.foreverplaced.net"));
server.binaryType = "arraybuffer";

server.onopen = () => {
  console.log("Connected to server!");
};

server.onmessage = (ev) => {
  const d = new Uint8Array(ev.data as ArrayBuffer);
  //TODO: Replace this switch hell
  console.log(d)
  switch (d[0]) {
    case 0x0:
      break;
    case 0x2:
      switch (d[1]) {
        case 0x1:
          // (chunkX, chunkY, coordX, coordY, color1, color2, color3)
          //TODO: manual
          const chunkSize = 0xff;
          const chunkX = d[2];
          const chunkY = d[3];
          // (pixel.data.y <= 0xFF) ? pixel.data.x : pixel.data.x * chunkSize - (chunkSize * 2);
          const x = chunkX == 0 ? d[4] : d[4] + chunkSize;
          const y = chunkY == 0 ? d[5] : d[5] + chunkSize;
          const color = "#" + bufferToHexStr(d.slice(6));
          postMessage({ type: "pixel", data: { x, y, color } });
          break;
      }
      break;
    case 0x3:
      switch (d[1]) {
        case 0x0:
          break;
        case 0x1:
          postMessage({ type: "playerCount", data: { count: d[2] } });
          break;
      }
      break;
  }
};

onmessage = (ev) => {
  const msg = ev.data as genericData;
  switch (msg.type) {
    case "pixel":
      const pixel = msg as pixelPlace;
      //TODO: Determined by server
      const chunkSize = 0xff;
      const chunkX = pixel.data.x <= 0xff ? 0x0 : 0x1;
      const chunkY = pixel.data.y <= 0xff ? 0x0 : 0x1;
      const x = pixel.data.y >= 0xff ? pixel.data.x + chunkSize - (chunkSize * 2) : pixel.data.x;
      const y = pixel.data.y >= 0xff ? pixel.data.y + chunkSize - (chunkSize * 2) : pixel.data.y;
      const color = hexStrTo8(pixel.data.color.replace("#", ""));
      server.send(new Uint8Array([0x1, chunkX, chunkY, x, y, ...color]));
      break;
  }
};

server.onclose = (ev) => {
  postMessage({ type: "error", code: ev.code, reason: ev.reason });
};
