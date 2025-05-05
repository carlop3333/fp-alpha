import { SuperMenuHandler } from "./helpers/handler";
import { FPData, hideElement, setupStats, showElement } from "./utils";
import { ModuleManager } from "./helpers/module";
import { setupNative } from "./modules/native";
import { clarity } from "./modules/clarity";
import { setMaintenance } from "./modules/menus/maintenance";
import { mobileHud } from "./modules/menus/hud";
import { KeyManager } from "./helpers/keys";

const FP_URL = import.meta.env.DEV
  ? "http://127.0.0.1:8788"
  : "https://foreverplaced.net";

//* FIRST AFTER EVERYTHING: create handlers
const rootHandler = new SuperMenuHandler(document.body);
const modManager = new ModuleManager();
const keyManager = new KeyManager();

//* Declare some shared vars
modManager.setSharedData("rootHandler", rootHandler);
modManager.setSharedData("keyManager", keyManager);
modManager.setSharedData("isUnsupported", false);
modManager.setSharedData("fpURL", FP_URL);

modManager.registerModule(setupNative);

//* FIRST OF ALL, CHECK THE WHOLE DATA
const data: FPData = await fetch(new URL("data", FP_URL)).then(async (res) => {
  const { discordLink, maintenance, maintenanceReason, server } =
    await res.json();
  return {
    discordLink,
    maintenance: maintenance === "true" ? true : false,
    maintenanceReason: maintenance === "true" ? maintenanceReason : false,
    server: new URL(server),
  };
});

modManager.setSharedData("srvData", data);

async function main() {
  await hideElement(document.body, 500);
  document.getElementById("temporal")!.remove();

  //* setup stats
  const stats = setupStats(document);

  showElement(document.body, "#FFF", 500);

  //* Setup Clarity and others
  modManager.registerModule([clarity, mobileHud]);

  //TODO: Move this as a shared module or smth like that
  function mainLoop() {
    stats.begin();

    stats.end();
    requestAnimationFrame(mainLoop);
  }

  requestAnimationFrame(mainLoop);
}

async function maintenance() {
  await hideElement(document.body, 500);
  document.getElementById("temporal")?.remove();
  modManager.registerModule(setMaintenance);
  showElement(document.body, "#7166f2", 500);
}

//** INIT
if (document.readyState !== "complete") {
  if (!data.maintenance) window.onload = main;
  else window.onload = maintenance;
} else {
  if (!data.maintenance) main();
  else maintenance();
}
