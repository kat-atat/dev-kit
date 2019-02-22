import vdom from "./vdom.js";

export default class DevKit extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({mode: "open"});
    this.shadow.innerHTML = this.constructor.TEMPLATE;
    vdom(this.shadow.querySelector(".vdom"));
  }

  static get TEMPLATE() {
    return `
<div class="vdom"></div>
    `;
  }
}