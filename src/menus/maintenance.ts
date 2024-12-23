import { setupNative } from "../helpers/native";
import { SuperMenuHandler } from "./menu";
import { marked } from "marked";

export function setMaintenance(root: SuperMenuHandler, content: string) {
  //* Setup maintenance page
  const parentNode = document.createElement("div");
  const semiRootNode = document.createElement("div");
  //* Tools icon
  const icon = document.createElement("span");
  icon.textContent = "construction";
  //* Button that opens Q&A page
  const qabutton = document.createElement("button");
  qabutton.textContent = "More info...";
  qabutton.className = "fpfont";

  //* Button function
  qabutton.addEventListener("click", async () => {
    const popup = root.createPopup("normal", {
      close: false,
      title: "Maintenance Status",
    });
    popup.editZone.innerHTML = await marked(content, {
      async: true,
      gfm: true,
    });
    popup.draw();
  });

  //* CSS Setup
  setupNative();

  icon.className = "mso mt";
  document.body.style.cssText =
    "background-color: #7166f2; overflow: hidden; margin: 0;";
  semiRootNode.style.cssText =
    "display: table;margin: auto; width: 100%; height: 100%; position: fixed;";
  qabutton.style.cssText =
    "display: block; margin: auto;background-color: transparent;border: 6px white solid;border-radius: 12px;color: white;font-size: 1.5rem;margin-top: 0.5rem;width: 4cm; cursor: pointer;";
  parentNode.style.cssText =
    "text-align: center;display: table-cell;vertical-align: middle;";

  parentNode.append(icon, qabutton);
  semiRootNode.append(parentNode);
  document.body.appendChild(semiRootNode);
}
