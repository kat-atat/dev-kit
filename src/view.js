import {h} from "./hyperapp.js";

const KEYCODE_ENTER = 13;
const KEYCODE_UP = 38;
const KEYCODE_DOWN = 40;

const onkeydown = (ev, state, action)=> {
  const {keyCode} = ev;
  switch (keyCode) {
    case KEYCODE_ENTER: return action.devkit.exec();
    case KEYCODE_UP: return action.devkit.prev();
    case KEYCODE_DOWN: return action.devkit.next();
  }
};

const view = (state, action)=>
  h("div", {class: "dev-kit"}, [
    h("textarea", {
      class: "dev-kit__output",
      readonly: true,
      onupdate: (el)=> {
        if (state.log.autoScroll) {
          el.scrollTop = el.scrollHeight;
        }
      },
    }, state.log.values.join("\n")),
    h("label", {class: "dev-kit__input"},
      h("input", {
        type: "text",
        value: state.devkit.value,
        oninput: ({target: {value}})=> action.devkit.set(value),
        onkeydown: (ev)=> onkeydown(ev, state, action),
      }),
    ),
    h("button", {
      class: "dev-kit__up",
      onclick: (ev)=> action.devkit.prev(),
    }),
    h("button", {
      class: "dev-kit__enter",
      onclick: (ev)=> action.devkit.exec(),
    }),
    h("button", {
      class: "dev-kit__auto-scroll-toggle"
      + (state.log.autoScroll ? " dev-kit__auto-scroll-toggle--checked" : ""),
      onclick: (ev)=> action.log.autoScrollToggleClick(),
    }),
  ])

export default view;