import { MenuHandler } from "./menu";
import { ColorPicker } from "./picker";

export function createHud(mh: MenuHandler) {
    mh.createRawElement("d");
    new ColorPicker()
}