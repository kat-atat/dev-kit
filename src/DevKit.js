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

  attributeChangedCallback(name, oldVal, newVal) {
    switch (name) {
      case "max-log-length": return this.vdom.set({maxLogLength: parseInt(newVal)});
    }
  }

  static get observedAttributes() {
    return [
      "max-log-length",
    ];
  }

  static get TEMPLATE() {
    return `
<style>
  :host,
  :host * { box-sizing: border-box; }

  :host {
    display: block;
    width: 100%;
  }

  :host input,
  :host button { -webkit-appearance: none; }

  :host input {
    width: 100%;
    font-size: 16px; /* supress iOS auto-zoom */
  }

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


  :host .devkit {
    display: flex;
    flex-flow: row wrap;
  }
  :host .output { flex: 1 0 auto; }
  :host .input { flex: 1 0 auto; }

  :host .up::before { content: "🔼"; }
  :host .enter::before { content: ">>"; }
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