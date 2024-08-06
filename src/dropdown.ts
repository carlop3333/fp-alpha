import { Stage } from "konva/lib/Stage";


export function updateDropdown(dCont: HTMLDivElement, ev: MouseEvent, stage: Stage) {
    const mouseDisp = dCont.querySelector("#mcoords");
    const canvasDisp = dCont.querySelector("#ccoords");
    const scaleDisp = dCont.querySelector("#scalecc");
    const canvasCoords = stage.position();
    


    mouseDisp!.textContent = `${ev.clientX},${ev.clientY}`;
    canvasDisp!.textContent = `${canvasCoords.x.toFixed()},${canvasCoords.y.toFixed()}`;
    scaleDisp!.textContent = stage.scaleX().toFixed(2);
    
}