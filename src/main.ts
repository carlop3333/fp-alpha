import "./styles.css";
import Stats from "stats.js";

//start stats first
const stats = new Stats();
stats.showPanel(0);
stats.dom.style.right = "0px";
stats.dom.style.removeProperty("left");
document.body.appendChild(stats.dom);

//get canvas
const canvas = document.querySelector("canvas");
//canvas init (resize)
canvas!.width = window.innerWidth;
canvas!.height = window.innerHeight; 
//apply legacy background
canvas!.style.transition = 'background-color 0.2s cubic-bezier(0.33, 1, 0.68, 1)';
const ctx = canvas!.getContext("2d");
if (ctx) {
    console.debug("Canvas init!");
    canvas!.style.backgroundColor = "#3d3d3d";
}

function mainLoop() {
    stats.begin();

    stats.end();
    requestAnimationFrame(mainLoop);
}

requestAnimationFrame(mainLoop);