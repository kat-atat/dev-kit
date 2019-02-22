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
  onkeydown: ({keyCode, target})=> (state)=> {
    const enterKeyCode = 13;
    const upKeyCode = 38;
    const downKeyCode = 40;
    switch (keyCode) {
      case enterKeyCode: return target.value !== "" ? action.eval({...state, input: target.value}) : {};
      case upKeyCode: return action.prev(state);
      case downKeyCode: return action.next(state);
    }
  },

  onupbuttonpress: ()=> (state)=> action.prev(state),
  onenterbuttonpress: ()=> (state)=> action.eval(state),

  prev: (state)=> {
    let previndex = Math.min(state.inputHistory.length-1, state.historyIndex+1);
    return {
      historyIndex: previndex,
      input: state.inputHistory[previndex],
    }
  },

  next: (state)=> {
    let nextIndex = Math.max(0, state.historyIndex-1);
    return {
      historyIndex: nextIndex,
      input: state.inputHistory[nextIndex],
    }
  },

  eval: (state)=> {
    return {
      input: "",
      inputHistory: [state.input, ...state.inputHistory],
      logHistory: [...state.logHistory, "eval(" + state.input + ")"],
      historyIndex: -1,
    }
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