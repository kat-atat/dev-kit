import vdom from "./vdom.js";

export default class DevKit extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({mode: "open"});
    this.shadow.innerHTML = this.constructor.TEMPLATE;
    this.vdom = vdom(this.shadow.querySelector(".vdom"));

    this.overrideNativeConsole();
    this.vdom.set({
      onpush: (string)=> {
        try {
          let result = stringify(evaluate(string));
          console.log(result);
        }
        catch (err) {
          console.log(err);
        }
      },
    });

    window.addEventListener("error", (err)=> errorhandler(err));
  }

  static get TEMPLATE() {
    return `
<style>
  :host, :host * {
    box-sizing: border-box;
  }

  :host button,
  :host input,
  :host textarea {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    line-height: 1em;
    vertical-align: top;
    border: solid black 0;
    border-radius: 0;
    -webkit-appearance: none;
    font-family: monospace;
  }

  :host .devkit {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
  }

  :host .output {
    width: 100%;
    height: 8em;
    background: #000;
    color: #fff;
    border: inset #888 2px;
  }

  :host .input {
    width: 80%;
    height: calc(1em + 4px);
    border: inset #888 2px;
  }

  :host .enter,
  :host .up {
    width: 10%;
    height: 2em;
    background-color: #888;
    border: outset #888 2px;
  }
</style>
<div class="vdom"></div>
    `;
  }
  
  overrideNativeConsole() {
    let original = console.log.bind(console);
    console.log = (function(...obj) {
      original(...obj);
      this.vdom.log(...obj);
    }).bind(this);
  }
}

let evaluate = (string)=> eval.call(window, string);

let stringify = (object)=> {
  switch (object) {
    case undefined: return "undefined";
    case null: return "null";
    default: return object + "";
  }
}

let errorhandler = (event)=> {
  let msg = `${event.message}`;
  if (event.filename !== undefined) {
    msg += `[${event.filename}: ${event.lineno}: ${event.colno}]`;
  }
  console.log(msg);
}