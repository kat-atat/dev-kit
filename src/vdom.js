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
  onkeydown: ({keyCode})=> (state)=> {
    const enterKeyCode = 13;
    const upKeyCode = 38;
    const downKeyCode = 40;
    if (keyCode === enterKeyCode) action.eval(state);
    if (keyCode === upKeyCode) action.prev(state);
    if (keyCode === downKeyCode) action.next(state);
  },

  onupbuttonpress: ()=> (state)=> action.prev(state),
  onenterbuttonpress: ()=> (state)=> action.eval(state),

  prev: (state)=> {
    if (state.inputHistory.length === 0) return;
    state.historyIndex = Math.max(0, state.historyIndex-1);
    state.input = state.inputHistory[state.historyIndex];
    console.log("prev");
  },

  next: (state)=> {
    if (state.inputHistory.length === 0) return;
    state.historyIndex = Math.min(state.inputHistory.length-1, state.historyIndex+1);
    state.input = state.inputHistory[state.historyIndex];
    console.log("next");
  },

  eval: (state)=> {
    if (state.input === "") {
      return;
    }
    state.inputHistory.push(state.input);
    state.input = "";
    if (state.maxInputHistory < state.inputHistory.length) state.inputHistory.shift();
    state.historyIndex = state.inputHistory.length;
    
    console.log("eval");
    console.log(state.input)
  },
};

let stringify = (object)=> {
  switch (object) {
    case undefined:
    object = "undefined";
    break;

    case null:
    object = "null";
    break;
  }

  return object;
}

const view = (state, action)=>
  h("div", {}, [
    h("textarea", {class: "logbox", readonly: true}, state.logHistory.map((item)=> stringify(item)).join("\n")),
    h("label", {},
      h("input", {class: "input", type: "text", value: state.input, onkeydown: (event)=> action.onkeydown(event)}),
    ),
    h("button", {class: "up", onclick: ()=> action.onupbuttonpress()}, "↑"),
    h("button", {class: "enter", onclick: ()=> action.onenterbuttonpress()}, ">>"),
  ])

export default (node)=> app(state, action, view, node);