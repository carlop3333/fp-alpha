//Clarity is beta-only; maybe on releases will be removed.
import Clarity from "@microsoft/clarity";
import { SuperMenuHandler } from "../helpers/handler";
import { Module } from "../helpers/module";

export const clarity: Module = {
  name: "clarity",
  async init(pubCtx) {
      const rootHandler = pubCtx.getData("rootHandler") as SuperMenuHandler;
      if (pubCtx.getData("isUnsupported") == true) {
        rootHandler.pushNotification(
          "Firefox is not supported.",
          "warning",
          "You cannot send feedback on Beta if you're using Firefox. This will be fixed in the future (Store release).",
          6
        );
      } else {
        // Detect that the user has an adblocker in order to tell that no feedback will be possible
        // use atob in order to avoid adblock link remove
        await fetch(atob("aHR0cHM6Ly9yLmNsYXJpdHkubXMvY29sbGVjdA=="), {
          method: "POST",
          headers: {
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "cross-site",
          },
          referrer: pubCtx.getData("fpURL"),
        })
          .then(() => {
            //If no adblocker is detected, we send a message for getting feedback
    
            Clarity.init(import.meta.env.VITE_CLARITY_TOKEN);
    
            rootHandler.pushNotification(
              "Welcome!",
              "normal",
              `Welcome to the beta! We may use some data to improve this game. This appears once and will be removed after beta. 
              </b></b> 
              <button class="fpbutton fpfont" id="accbut">Accept</button>
              <button class="fpbutton fpfont" id="decbut">Decline</button>`,
              30
            );
    
            document.getElementById("accbut")?.addEventListener("click", () => {
              console.log("Consent accepted");
              Clarity.consent(true);
              rootHandler.clearShownNotification();
            });
    
            document.getElementById("decbut")?.addEventListener("click", () => {
              console.log("Consent denied");
              Clarity.consent(false);
              rootHandler.clearShownNotification();
            });
          })
          .catch(() => {
            rootHandler.pushNotification(
              "Hey!",
              "warning",
              "An adblocker has been detected. Don't worry, if you're not going to send feedback you can ignore this.",
              6
            );
          });
      }
  },
}
