const noOp = ()=> {};

const state = {
  log: {
    values: [],
    maxLength: 64,
    autoScroll: true,
  },

  devkit: {
    history: {
      values: [],
      maxLength: 64,
    },
    historyIndex: 0,
    value: "",
    onpush: noOp,
  },
};

export default state;