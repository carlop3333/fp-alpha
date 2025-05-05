import { Module } from "../../helpers/module";

export const mobileHud: Module = {
    name: "hud",
    init(pubCtx) {
        const root = pubCtx.getData("rootHandler");
        const [hud, hudHandler] = root.createMenuHandler("hud");
        const canvasDiv = root.createRawElement("canvas");  
    },
}