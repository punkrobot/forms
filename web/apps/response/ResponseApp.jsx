import React from "react"
import { render } from "react-dom"
import { Provider } from "react-redux"

import FormResponse from "./components/FormResponse"
import ResponseStore from "./ResponseStore"

import "./styles/ResponseApp.css"


class ResponseApp extends React.Component {
  render() {
    return (
      <Provider store={ResponseStore}>
        <FormResponse />
      </Provider>
    )
  }
}

render(<ResponseApp/>, document.getElementById("form-response"))

