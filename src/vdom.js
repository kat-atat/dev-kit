import {h, app} from "./hyperapp.js";

const state = {
  input: "",
  history: [],
  maxHistoryLength: 64,
  historyIndex: 0,
  log: [],
  onpush: (string)=> {},
  maxLogLength: 8,
  KEYCODE_ENTER: 13,
  KEYCODE_UP: 38,
  KEYCODE_DOWN: 40,
};

const action = {
  oninput: ({target: {value}})=> ()=> ({input: value}),
  onupbuttonpress: ()=> (state)=> action.prev(state),
  onenterbuttonpress: ()=> (state)=> action.pushHistory(state),

  onkeydown: ({keyCode})=> (state)=> {
    switch (keyCode) {
      case state.KEYCODE_ENTER: return action.pushHistory(state);
      case state.KEYCODE_UP: return action.prev(state);
      case state.KEYCODE_DOWN: return action.next(state);
    }
  },

  prev: ({history, historyIndex})=> ({
    historyIndex: Math.min(historyIndex + 1, history.length - 1),
    input: history[Math.min(historyIndex + 1, history.length - 1)],
  }),

  next: ({history, historyIndex})=> ({
    historyIndex: Math.max(0, historyIndex - 1),
    input: history[Math.max(0, historyIndex - 1)],
  }),

  pushHistory: (state)=> {
    if (state.input !== "") {
      state.onpush(state.input);
      return {
        historyIndex: -1,
        input: "",
        history: [state.input, ...state.history].slice(0, state.maxHistoryLength),
      }
    }
  },

  log: (string)=> (state)=> ({
    log: [...state.log, string].slice(Math.max(0, state.log.length+1 - state.maxLogLength)),
  }),

  set: (newState)=> (oldState)=> ({...oldState, ...newState}),
};

const view = (state, action)=>
  h("div", {class: "devkit"}, [
    h("textarea", {class: "output", readonly: true}, state.log.join("\n")),
    h("label", {class: "input"},
      h("input", {
        type: "text",
        value: state.input,
        oninput: (event)=> action.oninput(event),
        onkeydown: (event)=> action.onkeydown(event),
      }),
    ),
    h("button", {class: "up", ontouchstart: (event)=> action.onupbuttonpress(event)}),
    h("button", {class: "enter", ontouchstart: (event)=> action.onenterbuttonpress(event)}),
  ])

export default (node)=> app(state, action, view, node);
