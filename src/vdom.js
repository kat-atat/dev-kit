import {h, app} from "./hyperapp.js";

const state = {
  input: "",
  inputHistory: [],
  maxInputHistory: 64,
  historyIndex: 0,
  logHistory: [],
  maxLogHistory: 8,
};

const action = {
  oninput: ({target})=> ()=> ({input: target.value}),
  onkeydown: ({keyCode})=> (state)=> {
    const enterKeyCode = 13;
    const upKeyCode = 38;
    const downKeyCode = 40;
    switch (keyCode) {
      case enterKeyCode: return action.push(state);
      case upKeyCode: return action.prev(state);
      case downKeyCode: return action.next(state);
    }
  },

  onupbuttonpress: ()=> (state)=> action.prev(state),
  onenterbuttonpress: ()=> (state)=> action.push(state),

  prev: ({historyIndex, inputHistory})=> {
    let prevIndex = Math.min(historyIndex + 1, inputHistory.length - 1);
    return {
      historyIndex: prevIndex,
      input: inputHistory[prevIndex],
    }
  },

  next: ({historyIndex, inputHistory})=> {
    let nextIndex = Math.max(0, historyIndex - 1);
    return {
      historyIndex: nextIndex,
      input: inputHistory[nextIndex],
    }
  },

  push: (state)=> {
    if (state.input === "") return;
    return {
      input: "",
      inputHistory: [state.input, ...state.inputHistory].slice(0, state.maxInputHistory),
      historyIndex: -1,
      ...action.log(state),
    }
  },

  log: (state)=> {
    return {
      logHistory: [...state.logHistory, state.log].slice(Math.max(0, state.logHistory.length+1 - state.maxLogHistory)),
    }
  },
};

let stringify = (object)=> {
  switch (object) {
    case undefined: return "undefined";
    case null: return "null";
    default: return object;
  }
}

const view = ({input, logHistory}, {oninput, onkeydown, onupbuttonpress, onenterbuttonpress})=>
  h("div", {}, [
    h("textarea", {class: "logbox", readonly: true}, logHistory.map((log)=> stringify(log)).join("\n")),
    h("label", {},
      h("input", {
        class: "input",
        type: "text",
        value: input,
        oninput: (event)=> oninput(event),
        onkeydown: (event)=> onkeydown(event),
      }),
    ),
    h("button", {class: "up", onclick: ()=> onupbuttonpress()}, "↑"),
    h("button", {class: "enter", onclick: ()=> onenterbuttonpress()}, ">>"),
  ])

export default (node)=> app(state, action, view, node);