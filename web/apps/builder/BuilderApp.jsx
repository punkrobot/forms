import React from "react"
import { render } from "react-dom"
import { Provider } from "react-redux"

import Form from "./components/Form"
import BuilderStore from "./BuilderStore"

import "./styles/BuilderApp.css"


class BuilderApp extends React.Component {
  render() {
    return (
      <Provider store={BuilderStore}>
        <Form />
      </Provider>
    )
  }
}

render(<BuilderApp/>, document.getElementById("form-builder"))
