class DevKitEvalLine extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = DevKitEvalLine.template;
    this.input = this.querySelector("input");
    this.prevButton = this.querySelectorAll("button")[0];
    this.runButton = this.querySelectorAll("button")[1];

    this.stack = [];
    this.stackSize = 64;
    this.referencingIndex = 0;

    this.prevButton.addEventListener("click", ()=> this.prev());
    this.runButton.addEventListener("click", ()=> this.run());
    this.input.addEventListener("keydown", (event)=> {
      const enterKeyCode = 13;
      const upKeyCode = 38;
      const downKeyCode = 40;
      if (event.keyCode === enterKeyCode) this.run();
      if (event.keyCode === upKeyCode) this.prev();
      if (event.keyCode === downKeyCode) this.next();
    });
  }

  run() {
    if (this.input.value === "") return;
    this.eval(this.input.value);
    this.stack.push(this.input.value);
    this.clear();
    this.update();
  }

  eval(string) {
    new Promise((resolve)=> resolve(eval.call(window, string)))
    .then((obj)=> this.onevaluated(obj))
    .catch((error)=> this.onevalerror(error));
  }

  clear() {
    this.input.value = "";
  }

  update() {
    if (this.stackSize < this.stack.length) this.stack.shift();
    this.referencingIndex = this.stack.length;
  }

  prev() {
    if (this.stack.length === 0) return;
    this.referencingIndex = Math.max(0, this.referencingIndex-1);
    this.input.value = this.stack[this.referencingIndex];
  }

  next() {
    if (this.stack.length === 0) return;
    this.referencingIndex = Math.min(this.stack.length-1, this.referencingIndex+1);
    this.input.value = this.stack[this.referencingIndex];
  }

  onevaluated(obj) {
  }

  onevalerror(error) {
  }

  static get is() {
    return "dev-kit-eval-line";
  }

  static get template() {
    const host = this.is;
    return `<style>
      ${host}, ${host} * { box-sizing: border-box; }
      ${host} input {
        width: 100%;
        font-size: 16px; /* supress iOS auto-zoom */
      }

      ${host} { display: flex; }
      ${host} .input { flex: 1 0 auto; }

      ${host} input,
      ${host} button { -webkit-appearance: none; }
      ${host} .prevButton::before { content: "🔼"; }
      ${host} .runButton::before { content: ">>"; }
    </style>

    <label class="input"><input type="text"/></label>
    <button class="prevButton"></button>
    <button class="runButton"></button>`;
  }
}


customElements.define(DevKitEvalLine.is, DevKitEvalLine);
