import { MenuHandler } from "./menu";
import { marked } from "marked";

const buttonFuncs = [changelog, factionsMenu, userMenu, settingsMenu];

async function changelog(menu: MenuHandler) {
  const m = menu.createMenu("normal", { close: true, title: "Changelog" });
  const req = await fetch("http://127.0.0.1:8787/api/changelog", {cache: "default"});
  m.editZone.className = "fpfont paragraph";
  m.editZone.innerHTML = await marked(await req.text());
  m.draw();  
}

function factionsMenu(menu: MenuHandler) {
  menu.pushNotification("Factions are coming soon!", 3);
}

function userMenu(menu: MenuHandler) {
  menu.pushNotification("Coming soon!", 3);
}

function settingsMenu(menu: MenuHandler) {
  menu.pushNotification("Coming soon!", 3);
}

export class Dropdown {
  dropdownButton: HTMLButtonElement;
  dropdownContent: HTMLDivElement;
  dropdownButtons: HTMLDivElement | undefined;
  menu: MenuHandler;

  constructor(button: HTMLButtonElement, content: HTMLDivElement, menu: MenuHandler) {
    this.dropdownButton = button;
    this.dropdownContent = content;
    this.menu = menu;
    this.#setup();
  }

  #setup() {
    const dcont = this.dropdownContent;
    const dbut = this.dropdownButton;
    dcont.innerHTML = `
        <h2 class="fpfont" style="text-align: center">Menu</h2>
        <div id="button-container">
          <button type="button" class="fpbutton">Changelog</button>
          <br>
          <button type="button" class="fpbutton">Factions menu (soon!)</button>
          <br>
          <button type="button" class="fpbutton">User area (soon!)</button>
          <br>
          <button type="button" class="fpbutton">Settings</button>
        </div>
        <h2>Debug details:</h2>
        <button type="button" class="fpbutton">Test captcha</button>`;
    this.dropdownButtons = dcont.querySelector("#button-container") as HTMLDivElement;

    dcont.style.visibility = "hidden";
    dbut.addEventListener("click", () => {
      if (dcont.style.visibility === "hidden") {
        dcont.style.visibility = "visible";
      } else {
        dcont.style.visibility = "hidden";
      }
    });

    let ind = 0;
    for (const element of this.dropdownButtons.children) {
      if (element.tagName == "BUTTON") {
        //...
        const index = ind;
        //adds eventlisteners in order
        (element as HTMLButtonElement).addEventListener("click", () =>
          buttonFuncs[index](this.menu)
        );
        ind++;
      }
    }
  }
}
