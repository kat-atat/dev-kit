import css from "./css.js";
import vdom from "./vdom.js";
import hookFunctions from "./hookFunctions.js";

export default class DevKit extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({mode: "open"});
    this.shadow.innerHTML = this.constructor.TEMPLATE;
    this.vdom = vdom(this.shadow.querySelector(".main"));

    this.vdom.setOnpush((string)=> {
      let result = evaluate(string);
      this.log(result);
    });

    window.addEventListener("error", (err)=> {
      let msg = `${event.message}`;
      if (event.filename) {
        msg += `[${event.filename}: ${event.lineno}: ${event.colno}]`;
      }
      this.log(msg);
    });

    hookFunctions(console, this);
  }

  log(...objects) {
    objects.map((object)=> stringify(object))
    .forEach((string)=> this.vdom.pushLog(string));
  }

  attributeChangedCallback(name, oldVal, newVal) {
    switch (name) {
      case "max-log-length": return this.vdom.setMaxLogLength(parseInt(newVal));
    }
  }

  static get observedAttributes() {
    return [
      "max-log-length",
    ];
  }

  static get TEMPLATE() {
    return `
<style>${css}</style>
<div class="main"></div>
    `;
  }
}


const evaluate = (string)=> {
  try {
    return eval.call(window, string);
  }
  catch (err) {
    return err;
  }
}

const stringify = (object)=> {
  switch (object) {
    case undefined: return "undefined";
    case null: return "null";
    default: return object + "";
  }
}
