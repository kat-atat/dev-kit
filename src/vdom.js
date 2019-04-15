import {app} from "./hyperapp.js";
import state from "./state.js";
import action from "./action.js";
import view from "./view.js";

export default (node)=> app(state, action, view, node);
