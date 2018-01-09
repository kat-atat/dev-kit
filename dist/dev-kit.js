import "./dev-kit-console-log.js";
import "./dev-kit-eval-line.js";


class DevKit extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    if (this._constructed) return;
    this._constructed = true;
    this.innerHTML = DevKit.template;
    this.console = this.querySelector("dev-kit-console-log");
    this.evalLine = this.querySelector("dev-kit-eval-line");

    window.addEventListener("error", (e)=> this.onevalerror(e));
    this.evalLine.onevaluated = (obj)=> this.console.log(obj);
    this.evalLine.onevalerror = (e)=> this.onevalerror(e);
  }

  onevalerror(e) {
    let msg = `${e.message}`;
    if (e.filename !== undefined) {
      msg += `[${e.filename}: ${e.lineno}: ${e.colno}]`;
    }
    this.console.log(msg);
  }

  static get is() {
    return "dev-kit";
  }

  static get template() {
    const host = this.is;
    return `<style>
        ${host} {
          display: block;
          width: 100%;
        }
      </style>

      <dev-kit-console-log></dev-kit-console-log>
      <dev-kit-eval-line></dev-kit-eval-line>`;
  }
}


customElements.define(DevKit.is, DevKit);
