import vdom from "./vdom.js";

export default class DevKit extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({mode: "open"});
    this.shadow.innerHTML = this.constructor.TEMPLATE;
    this.vdom = vdom(this.shadow.querySelector(".vdom"));

    this.overrideNativeConsole();

    this.vdom.onpushed((string)=> {
      try {
        let result = stringify(evaluate(string));
        console.log(result);
      }
      catch (err) {
        console.log(err);
      }
    });
    window.addEventListener("error", (err)=> errorhandler(err));
  }

  static get TEMPLATE() {
    return `
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