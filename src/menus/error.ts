import { MenuHandler } from "./menu"

export function launchErrorPage(menu: MenuHandler, code: number, reason: string) {
  const errorPage = menu.createRawPopup("reloadwind");
  errorPage.innerHTML = `
        <h1 class="fpfont big">uh oh! An error happened.</h1>
        <p class="fpfont little">
          ${code == 1006 ? "The connection was abruptly closed. The server may be down. " : `The server closed connection with code ${code}${reason == "" ? "." : ":"} ${reason}`}
        </p>
        <br/>
        <p class="fpfont little">Don't worry, the page will reload in seconds.</p>
  ` 
  setTimeout(() => errorPage.style.opacity = "1", 500);
  setTimeout(() => location.reload(), 6000);
}


