import LogBox from "./LogBox.js";
import CommitLine from "./CommitLine.js";


customElements.define("log-box", LogBox);
customElements.define("commit-line", CommitLine);
const TEMPLATE =
`<style>
  :host {
    display: block;
    width: 100%;
  }
</style>

<div>
  <log-box></log-box>
  <commit-line></commit-line>
</div>`;


class DevKit extends HTMLElement {
  constructor() {
    super();

    let shadow = this.attachShadow({mode: "open"});
    shadow.innerHTML = TEMPLATE;

    this.logBox = shadow.querySelector("log-box");
    this.commitLine = shadow.querySelector("commit-line");

    window.addEventListener("error", this);
    this.commitLine.addEventListener("commit", this);
    this.overrideNativeConsole();
  }

  handleEvent(event) {
    if (event.type === "commit") {
      let value = event.detail.value;
      let result = this.eval(value);
      this.logBox.log(result);
    }

    if (event.type === "error") {
      let msg = `${event.message}`;
      if (event.filename !== undefined) {
        msg += `[${event.filename}: ${event.lineno}: ${event.colno}]`;
      }
      this.logBox.log(msg);
    }
  }

  overrideNativeConsole() {
    let original = console.log.bind(console);
    console.log = (function log(...obj) {
      original(...obj);
      this.logBox.log(...obj);
    }).bind(this);
  }

  eval(string) {
    return eval.call(window, string);
  }
}


export default DevKit;