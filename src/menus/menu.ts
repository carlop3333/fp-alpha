//TODO: Rework open/close animations code
class Menu {
  /**
   * Only for menu appending, do not use!
   */
  public element: HTMLDivElement;
  protected parentHandler: MenuHandler;
  /**
   * Use this zone when editing data!
   */
  public editZone: HTMLDivElement;
  protected title?: HTMLHeadingElement;

  constructor(
    type: "normal" | "mini",
    settings: MenuSettings,
    parentHandler: MenuHandler
  ) {
    this.parentHandler = parentHandler;
    this.element = document.createElement("div");
    this.editZone = document.createElement("div");
    type == "normal"
      ? (this.element.className = "menu")
      : (this.element.className = "menu mini");
    //* close button
    if (settings.close) {
      const closeButton = document.createElement("span");
      closeButton.className = "closebutton big";
      closeButton.innerHTML = '<i class="mso big">close</i>';
      closeButton.addEventListener("click", () => this.close());
      this.element.appendChild(closeButton);
    }
    //* title
    if (settings.title) {
      this.title = document.createElement("h1");
      this.title.className = "fpfont title";
      this.title.textContent = settings.title;
      this.element.appendChild(this.title);
    }
    //* editZone fonts/margin & appending
    this.editZone.style.margin = "0.3em 1em 0px 1em";
    this.editZone.style.overflow = "auto";
    this.editZone.className = "fpfont paragraph noweight";
    this.element.appendChild(this.editZone);
  }
  changeTitle(title: string) {
    if (this.title) {
      this.title.textContent = title;
    } else throw new EvalError("No title has been set at start!");
  }
  draw() {
    this.element.parentElement?.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 350,
      easing: "cubic-bezier(0,1.16,.81,1)",
      fill: "forwards",
    });
  }
  close() {
    this.element.parentElement?.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: 350,
      easing: "cubic-bezier(0,1.16,.81,1)",
      fill: "forwards",
    });
    setTimeout(() => {
      this.parentHandler.closeRawElement("overlay");
      Object.freeze(this);
    }, 400);
  }
}
/*
  <div class="menu">
    <span class="closebutton big" style="right: 0px;">
      <i class="mso big">close</i>
    </span>
  </div>
*/

export class MenuHandler {
  private body: HTMLElement;
  protected rawItems: Array<HTMLDivElement>;
  
  protected exists: boolean;

  protected lastMenu!: Menu;
  
  constructor(element: HTMLElement) {
    this.body = element;
    this.rawItems = new Array<HTMLDivElement>();
    this.exists = true;
  }
  createPopup(type: "normal" | "mini", settings?: MenuSettings) {
    if (this.exists) {
      const overlay = this.getRawPopup("overlay");
      const stts = !settings ? { close: true } : settings;
      if (overlay) {
        //if there's a overlay that does mean there is a menu as well
        this.lastMenu.close();
        const menu = new Menu(type, stts, this);
        this.lastMenu = menu;
        this.getRawPopup("overlay")?.appendChild(menu.element);
        return menu;
      } else {
        const menu = new Menu(type, stts, this);
        this.lastMenu = menu;
        //we create a new raw popup
        this.createRawElement("overlay").appendChild(menu.element);
        return menu;
      }
    } else throw new EvalError("element does not exist")
  }
  /**
   * Creates a raw element, at the body level.
   *
   * @param {string} id Id for div element.
   * @returns {HTMLDivElement}
   */
  createRawElement(id: string): HTMLDivElement {
    if (this.exists) {
      const popup: HTMLDivElement = document.createElement("div");
      popup.id = id;
      this.body.appendChild(popup);
      this.rawItems.push(popup);
      return popup;
    } else throw new EvalError("element does not exist")
  }
  /**
   * Closes a raw element, at the body level.
   *
   * @param {string} id Id for div element.
   * @returns {void}
   */
  closeRawElement(id: string): void {
    if (this.exists) {
      this.rawItems.forEach((el, ind) => {
        if (el.id == id) {
          this.body.removeChild(el);
          this.rawItems.splice(ind, 1);
        }
      });
    } else throw new EvalError("element does not exist")
  }
  /**
   * Creates a new MenuHandler
   *
   * @param {string} id Id for div element.
   * @returns {[HTMLDivElement, MenuHandler]}
   */
  createMenuHandler(id: string): [HTMLDivElement, MenuHandler] {
    const divReturned = this.createRawElement(id)
    return [divReturned, new MenuHandler(divReturned)]
  }
  /**
   * Removes THIS MenuHandler, and makes it unusable after
   *
   * @returns {void}
   */
  deleteThisHandler(): void {
    this.exists = false
    Object.freeze(this);
  }

  protected getRawPopup(id: string): HTMLDivElement | undefined {
    for (const el of this.rawItems) {
      if (el.id == id) return el;
    }
  }
}

export class SuperMenuHandler extends MenuHandler {

  constructor(element: HTMLElement) {
    super(element);
    this.notifications = new Array<Notification>();
  }

  protected notifications: Array<Notification>;
  protected notifShow: boolean | undefined;

  protected checkNotifications() {
    //fix in case other notifs are being pushed so no duplicates
    if (this.notifications.length == 0 || this.notifShow) return;
    this.notifShow = true;
    //notif checker
    const check = () => {
      //* notif killer
      const killNotification = () => {
        notif.style.right = "-12cm";
        setTimeout(() => {
          this.closeRawElement("notification");
          if (this.notifications.length !== 0) check();
          else this.notifShow = false;
        }, 1000);
      };
      const notifData = this.notifications.shift() as Notification;
      //* html notif
      const notif = this.createRawElement("notification");
      //* close button
      const notifButton = document.createElement("span");
      notifButton.className = "closebutton";
      notifButton.innerHTML = '<i class="mso">close</i>';
      notifButton.addEventListener("click", killNotification);
      //* Title
      const notifTitle = document.createElement("h3");
      notifTitle.textContent = notifData.title;
      notifTitle.className = "fpfont little";
      notifData.titleType == "success"
        ? (notifTitle.style.color = "lightgreen")
        : notifData.titleType == "error"
        ? (notifTitle.style.color = "#d14c2e")
        : notifData.titleType == "warning"
        ? (notifTitle.style.color = "yellow")
        : (notifTitle.style.color = "white");
      //* Text
      const notifText = document.createElement("p");
      notifText.textContent = notifData.text;
      notifText.className = "fpfont notif";
      //* appends
      notif.append(notifButton, notifTitle, notifText);
      //* start transition
      setTimeout(() => {
        notif.style.right = "10px";
      }, 100);
      //* timeout for killing notif
      setTimeout(killNotification, notifData.duration * 1000);
    };
    //start checking notifications
    check();
  }
  /**
   * Pushes a notification onto UI
   *
   * @param {string} text Notification text
   * @param {number} duration Duration of the notification in seconds
   */
  pushNotification(
    title: string,
    titleType: Notification["titleType"],
    text: string,
    duration: number
  ) {
    this.notifications.push({ title, titleType, text, duration });
    this.checkNotifications();
  }
}


interface MenuSettings {
  close: boolean;
  title?: string;
}
type Notification = {
  title: string;
  titleType: "normal" | "success" | "warning" | "error";
  text: string;
  duration: number;
};
