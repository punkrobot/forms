import React from "react"

import { FormControl } from "react-bootstrap"


class SelectTableCell extends React.Component {
  
  updateValueHandler = (e) => {
    this.props.updateAnswer({
      code: this.props.code,
      answer: e.target.value
    })
  }
  
  render() {
    let choices = this.props.choices.map(choice => {
      return <option key={choice.key} value={choice.value}>{choice.text}</option>
    })
    return (
      <FormControl componentClass="select" onChange={this.updateValueHandler}>
        <option value="0">Selecciona una opción ... </option>
        {choices}
      </FormControl>
    )
  }
}

export default SelectTableCell
