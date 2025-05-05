//  Just like module.ts init()
type KeyCallback = () => void;

export class KeyManager {
  private actions: Map<string, KeyCallback>; //action-name, callback
  private bindings: Map<string, string>; //key, action-name -- makes it easier to difference at init
  isOnMenu: boolean | undefined; //disables the key system on menus

  constructor() {
    this.actions = new Map();
    this.bindings = new Map();
    window.addEventListener("keydown", (ev) => this.handleKey(ev));
  }

  private handleKey(ev: KeyboardEvent) {
    const key = ev.key.toLowerCase(); // remove duplicates
    const callback = this.actions.get(this.bindings.get(key) ? key : "none");
    if (callback && !this.isOnMenu) {
      callback();
    }
  }

  setupAction(actionName: string, callback: KeyCallback) {
    if (!this.actions.has(actionName)) {
        this.actions.set(actionName, callback);
    } throw new Error("Action already declared. Only 1 action can be declared per name/per session.")
  }

  /**
   * Binds a key into the key system. NOTE: ALL keys are in lowercase (to avoid dups)
   * @param key The key you want to use, e.g: "j" or "arrowup"
   * @param callback What you want to be executed after the key is pressed
   */
  bindKey(key: string, actionName: string) {
    if (!this.actions.has(key)) {
      this.bindings.set(key.toLowerCase(), actionName);
    } else throw new TypeError("Key exists.");
  }

  /**
   * Unbinds a key.
   *
   * @param {string} key The key you want to unbind.
   */
  unbindKey(key: string) {
    if (this.actions.has(key)) {
      this.bindings.delete(key);
    } else throw new TypeError("Key does not exist.");
  }

  /** Creates a list of binded keys in JSON */
  listKeys() {
    let x: { [y: string]: any } = {};
    this.bindings.forEach((action, key) => (x[key] = action));
    return x;
  }
}
