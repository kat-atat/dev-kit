export default `
* { box-sizing: border-box; }

input { width: 100%; }

textarea {
  margin: 0;
  padding: 0;
  border-radius: 0;
}

textarea {
  width: 100%;
  min-height: 8em;
  line-height: 1em;
  font-family: monospace;
  font-size: 8px;
  background: black;
  color: white;
}

.dev-kit {
  display: flex;
  flex-flow: row wrap;
}

.dev-kit>.dev-kit__output { flex: 1 0 auto; }
.dev-kit>.dev-kit__input { flex: 1 0 auto; }

.dev-kit>.dev-kit__up::before { content: "🔼"; }
.dev-kit>.dev-kit__enter::before { content: ">>"; }
.dev-kit>.dev-kit__auto-scroll-toggle::before { content: "▶️"; }
.dev-kit>.dev-kit__auto-scroll-toggle--checked::before { content: "⏸"; }


input,
button {
  -webkit-appearance: none;
}

input {
  font-size: 16px; /* supress iOS auto-zoom */
}
`;