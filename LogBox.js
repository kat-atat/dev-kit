const TEMPLATE =
`<style>
  :host,
  :host * { box-sizing: border-box; }

  :host textarea {
    margin: 0;
    padding: 0;
    border-radius: 0;
  }

  :host textarea {
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


class LogBox extends HTMLElement {
  constructor() {
    super();

    let shadow = this.attachShadow({mode: "open"});
    shadow.innerHTML = TEMPLATE;

    this.textarea = shadow.querySelector("textarea");
    this.stack = [];
    this.stackSize = 8;
  }

  log(...obj) {
    let inputs = obj;
    inputs.forEach((input)=> {
      this.stack.push(input);
      if (this.stackSize < this.stack.length) {
        this.stack.shift();
      }
    });
    this.update();
  }

  update() {
    this.textarea.textContent =
    this.stack.map((item)=> this.stringify(item)).join("\n");
  }

  stringify(object) {
    switch (object) {
      case undefined:
      object = "undefined";
      break;

      case null:
      object = "null";
      break;
    }

    return object;
  }
}


export default LogBox;