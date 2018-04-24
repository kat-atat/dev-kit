class CommitLine extends HTMLElement {
  constructor() {
    super();

    let shadow = this.attachShadow({mode: "open"});

    shadow.innerHTML = CommitLine.template;

    this.input = shadow.querySelector("input");
    this.prevButton = shadow.querySelectorAll("button")[0];
    this.commitButton = shadow.querySelectorAll("button")[1];

    this.stack = [];
    this.stackSize = 64;
    this.referencingIndex = 0;

    this.prevButton.addEventListener("click", this);
    this.commitButton.addEventListener("click", this);
    this.prevButton.addEventListener("touchstart", this);
    this.commitButton.addEventListener("touchstart", this);
    this.input.addEventListener("keydown", this);
  }

  handleEvent(event) {
    if (event.type === "touchstart") {
      event.preventDefault(); // on iOS, supress onscreen-keyboard hiding
    }

    if (event.type === "click" || event.type === "touchstart") {
      if (event.target === this.prevButton) this.prev();
      if (event.target === this.commitButton) this.commit();
    }

    if (event.type === "keydown") {
      const enterKeyCode = 13;
      const upKeyCode = 38;
      const downKeyCode = 40;
      if (event.keyCode === enterKeyCode) this.commit();
      if (event.keyCode === upKeyCode) this.prev();
      if (event.keyCode === downKeyCode) this.next();
    }
  }

  commit() {
    let value = this.input.value;
    if (value === "") {
      return;
    }

    else {
      this.clear();
      this.stack.push(value);
      this.update();

      let event = new CustomEvent("commit", {detail: {value}});
      this.dispatchEvent(event);
    }
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

  static get is() {
    return "commit-line";
  }

  static get template() {
    return `<style>
      :host, :host * { box-sizing: border-box; }
      :host input {
        width: 100%;
        font-size: 16px; /* supress iOS auto-zoom */
      }

      :host { display: flex; }
      :host .input { flex: 1 0 auto; }

      :host input,
      :host button { -webkit-appearance: none; }
      :host .prevButton::before { content: "🔼"; }
      :host .commitButton::before { content: ">>"; }
    </style>

    <label class="input"><input type="text"/></label>
    <button class="prevButton"></button>
    <button class="commitButton"></button>`;
  }
}


customElements.define(CommitLine.is, CommitLine);

