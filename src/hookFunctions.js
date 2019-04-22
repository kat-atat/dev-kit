const hookFunctions = (target, methods)=> {
  for (let key in target) {
    if (typeof target[key] === "function" && typeof methods[key] === "function") {
      const original = target[key].bind(target);
      target[key] = function(...args) {
        original(...args);
        methods[key](...args);
      }
    }
  }
}

export default hookFunctions;