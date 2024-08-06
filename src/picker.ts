import { componentToHex } from "./utils";

export class colorPicker {
  block: CanvasRenderingContext2D;
  input: HTMLInputElement;
  label: HTMLLabelElement;
  #color: string;

  constructor(block: HTMLCanvasElement, input: HTMLInputElement, label: HTMLLabelElement) {
    this.block = block.getContext("2d")!;
    this.label = label;
    this.#color = "#ffffff";
    input.value = this.#color;
    this.input = input;
  }
  #setupInput() {
    let validHex = this.#color;
    this.input.addEventListener("input", () => {
      if (this.input.value.startsWith("#")) {
        let passChecks = 0;
        for (var i = 1; i <= 6; i++) {
          const char = this.input.value.charCodeAt(i);
          // from (a to f) || (A to F) || (0 to 9)
          if (
            (char <= 102 && char >= 97) ||
            (char <= 70 && char >= 65) ||
            (char <= 57 && char >= 48)
          ) {
            passChecks += 1;
          }
        }
        if (passChecks == 6) {
          validHex = this.input.value;
          this.#setColor(validHex, true);
        } else if (passChecks == 3) {
          const t = this.input.value;
          const transform = "#" + t[1] + t[1] + t[2] + t[2] + t[3] + t[3];
          validHex = transform;
          this.#setColor(transform, true);
        }
      } else {
        this.input.value = validHex;
      }
    });
  }

  #setEventListeners() {

    this.block.canvas.onmousedown = () => {

      //listener that gets ImageData
      this.block.canvas.onmousemove = (ev) => {
        var d = this.block.getImageData(ev.offsetX, ev.offsetY, 1, 1)
        this.#setColor('#' + componentToHex(d.data[0]) + componentToHex(d.data[1]) + componentToHex(d.data[2]))
      }

      this.block.canvas.onmouseup = () => {
        //removes listener, hoping does not cause a memo leak
        this.block.canvas.onmousemove = null;
      }
    }
  }

  setup() {
    this.#setupInput();

    //create rgb gradient
    const colorGrad = [
      "rgb(255, 0, 0)",
      "rgb(255, 0, 255)",
      "rgb(0, 0, 255)",
      "rgb(0, 255, 255)",
      "rgb(0, 255, 0)",
      "rgb(255, 255, 0)",
      "rgb(255, 0, 0)",
    ];
    //color gradient
    var gradient = this.block.createLinearGradient(0, 0, this.block.canvas.width, 0);
    //some idea i had for rainbow gradients
    for (let g = 0, s = 0, gt = 0.15; g <= 1 && s <= 6; s++) {
      /*
       * g -> gradient offset
       * gt -> gradient constant
       * s -> stops
       */
      gradient.addColorStop(g, colorGrad[s]);
      if (g == 0) gt = 0.17;
      else if (gt <= 0.15) gt = 0.18;
      //0.15 -> 0.33 -> 0,49 -> ...
      g += gt;
      //rounding fix
      g = parseFloat(g.toFixed(2));
      //0.15, 0.18, 0,16 <-- loop by even and odd
      if (s % 2 == 0) gt -= 0.02;
      else if (s % 2 == 1) gt -= 0.01;
      //little fix :)
      if (g == 1.01) g = 1;
    }
    this.block.fillStyle = gradient;
    this.block.fillRect(0, 0, this.block.canvas.width, this.block.canvas.height);

    //white black gradient
    gradient = this.block.createLinearGradient(0,0,0, this.block.canvas.height);
    // manual gradient because yes
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.5, "rgba(255, 255, 255, 0)");
    gradient.addColorStop(0.5, "rgba(0, 0, 0, 0)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 1)");

    this.block.fillStyle = gradient;
    this.block.fillRect(0, 0, this.block.canvas.width, this.block.canvas.height);

    //event listeners
    this.#setEventListeners();
  }
  #setColor(color: string, fromInput: boolean = false) {
    this.#color = color;
    this.label.style.backgroundColor = color;
    if (!fromInput) this.input.value = color;
  }
  get color() {
    return this.#color;
  }
}
