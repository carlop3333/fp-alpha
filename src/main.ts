//Clarity is beta-only; maybe on releases will be removed.
import Clarity from "@microsoft/clarity";

import { setupNative } from "./helpers/native";
import { createHud } from "./menus/hud";
import { SuperMenuHandler } from "./menus/menu";
import { FPData, hideElement, setupStats, showElement } from "./utils";
import { setMaintenance } from "./menus/maintenance";
/* import { setMaintenance } from "./menus/maintenance"; */

const FP_URL = (import.meta.env.DEV) ? "http://127.0.0.1:8788" : "https://foreverplaced.net";

//* FIRST AFTER EVERYTHING: create menu handler
const rootHandler = new SuperMenuHandler(document.body);

let isUnsupported = false;
export const setUnSupported = (is: boolean) => (isUnsupported = is);

//* setup native
await setupNative();

//* FIRST OF ALL, CHECK THE WHOLE DATA
const data: FPData = await fetch(new URL("data", FP_URL)).then(async (res) => {
  const {discordLink, maintenance, maintenanceReason, server} = await res.json() 
  const obj: FPData = {discordLink, maintenance: ((maintenance === "true") ? true : false), maintenanceReason, server: new URL(server)};
  return obj;
})

if (!data.maintenance) {

  await hideElement(document.body, 500);
  document.getElementById("temporal")?.remove();

  /* const [hud, hudHandler] = rootHandler.createMenuHandler("hud");
  const canvasDiv = rootHandler.createRawElement("canvas");  */


  //* setup stats
  const stats = setupStats(document);
  

  //* Setup Clarity
  if (isUnsupported)
    rootHandler.pushNotification(
      "Firefox is not supported.",
      "warning",
      "You cannot send feedback on Beta if you're using Firefox. This will be fixed in the future (Store release).",
      6
    );
  else {
    //TODO: Add user-id in order to make ux 1000x better
    Clarity.init("p3s2j9obbf"); 
    // Detect that the user has an adblocker in order to tell that no feedback will be possible
    //* use atob in order to avoid adblock link remove
    await fetch(atob("aHR0cHM6Ly93d3cuY2xhcml0eS5tcy9jb2xsZWN0")).catch(() => {console.log("Adblocker detected")}) 
    
  }

  createHud(rootHandler);



  //* Loading ended.
  showElement(document.body, "#FFF", 500);

  function mainLoop() {
    stats.begin();

    stats.end();
    requestAnimationFrame(mainLoop);
  }

  requestAnimationFrame(mainLoop);
} else {
  await hideElement(document.body, 500);
  document.getElementById("temporal")?.remove();
  setMaintenance(rootHandler, data.maintenanceReason);
  showElement(document.body, "#7166f2", 500);
}
