const history = {
  push: (value)=> (state)=> ({
    values: [value, ...state.values].slice(0, state.maxLength),
  }),
}

const log = {
  push: (value)=> (state)=> ({
    values: [...state.values, value].slice(Math.max(0, state.values.length + 1 - state.maxLength)),
  }),

  setMaxLength: (num)=> ({maxLength: num}),

  autoScrollToggleClick: ()=> (state)=> ({autoScroll: !state.autoScroll}),
}

const devkit = {
  history,

  prev: ()=> (state)=> ({
    historyIndex: Math.min(state.historyIndex + 1, state.history.values.length - 1),
    value: state.history.values[Math.min(state.historyIndex + 1, state.history.values.length - 1)],
  }),

  next: ()=> (state)=> ({
    historyIndex: Math.max(0, state.historyIndex - 1),
    value: state.history.values[Math.max(0, state.historyIndex - 1)],
  }),

  set: (value)=> ({value}),

  exec: ()=> (state, action)=> {
    if (state.value !== "") {
      action.history.push(state.value);
      state.onpush(state.value);
      return {
        historyIndex: -1,
        value: "",
      };
    }
  },

  setOnpush: (cb)=> (state)=> ({onpush: cb}),
}

const methods = {
  setOnpush: (cb)=> (state, action)=> action.devkit.setOnpush(cb),
  setMaxLogLength: (num)=> (state, action)=> action.log.setMaxLength(num),
  pushLog: (value)=> (state, action)=> action.log.push(value),
}


const action = {
  log,
  devkit,
  ...methods,
};

export default action;