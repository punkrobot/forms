import { createStore } from 'redux'

import ResponseReducer from './ResponseReducer'


let ResponseStore = createStore(
  ResponseReducer,
  window.devToolsExtension && window.devToolsExtension()
)

export default ResponseStore
