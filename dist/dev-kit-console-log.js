class DevKitConsoleLog extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = DevKitConsoleLog.template;
    this.textarea = this.querySelector("textarea");
    this.stack = [];
    this.stackSize = 8;
    this.overrideNativeConsole();
  }

  log() {
    let inputs = [...arguments];
    inputs.forEach((input)=> {
      this.stack.push(input);
      if (this.stackSize < this.stack.length) this.stack.shift();
    });
    this.update();
  }

  update() {
    this.textarea.textContent =
    this.stack.map((item)=> this.stringify(item)).join("\n");
  }

  stringify(object) {
    if (object === undefined) object = "undefined";
    if (object === null) object = "null";
    return object;
  }

  overrideNativeConsole() {
    let original = console.log.bind(console);
    console.log = (function log() {
      original(...arguments);
      this.log(...arguments);
    }).bind(this);
  }

  static get is() {
    return "dev-kit-console-log";
  }

  static get template() {
    const host = this.is;
    return `<style>
      ${host},
      ${host} * { box-sizing: border-box; }

      ${host} textarea {
        margin: 0;
        padding: 0;
        border-radius: 0;
      }

      ${host} textarea {
        width: 100%;
        min-height: 8em;
        line-height: 1em;
        font-family: monospace;
        text-size: 16px;
        background: black;
        color: white;
      }
    </style>

    <textarea readonly></textarea>`;
  }
}


customElements.define(DevKitConsoleLog.is, DevKitConsoleLog);
