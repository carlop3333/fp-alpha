import { Capacitor } from "@capacitor/core";
import { MutatedDocument } from "../utils";
import { StatusBar } from "@capacitor/status-bar";
import * as Platform from "platform";
import { Module } from "../helpers/module";

export const setupNative: Module = {
  name: "nativeSet",
  init(pubCtx) {
    if (Capacitor.isNativePlatform()) {
      //* Native Mobile platforms
      (document as MutatedDocument).isMobile = true;
      import("../css/native-style.css");
      StatusBar.setOverlaysWebView({ overlay: true });
    } else if (
      import.meta.env.DEV ||
      Platform.os?.family == "Android" ||
      Platform.os?.family == "iOS"
    ) {
      //* Web mobile, debug option also
      (document as MutatedDocument).isMobile = true;
      import("../css/mobile-style.css");
    } else {
      //* Desktop
      import("../css/pwa-style.css");
      (document as MutatedDocument).isMobile = false;
      //* Detect Firefox for Clarity feedback
      //@ts-ignore
      if (window.InstallTrigger !== undefined) {
        pubCtx.setData("isUnsupported", true);
      }
    }
  },
}

