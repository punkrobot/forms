import { createStore } from "redux"

import BuilderReducer from "./BuilderReducer"


let BuilderStore = createStore(
  BuilderReducer,
  window.devToolsExtension && window.devToolsExtension()
)

export default BuilderStore
