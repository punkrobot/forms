import React from "react"

import { FormControl } from "react-bootstrap"


class InputTableCell extends React.Component {

  constructor(props) {
    super(props)
    this.state = { checked: false }
  }
  
  updateValueHandler = (e) => {
    let value = e.target.value.trim()

    if(this.props.type === "checkbox"){
      value = this.state.checked ? "n" : "y"
      this.setState({checked: !this.state.checked})
    }

    if(this.props.type === "radio") {
      this.props.updateAnswer({
        code: this.props.code,
        answer: value,
        label: this.props.label
      })

    } else if(this.props.type === "checkbox") {
      this.props.updateAnswer({
        code: this.props.code,
        answer: value,
        label: value === "n" ? "No" : "Sí"
      })

    } else {
      this.props.updateAnswer({
        code: this.props.code,
        answer: value
      })
    }
  }
  
  render() {
    let componentProps = {}
    if (this.props.type === "checkbox") {
      componentProps.defaultChecked = this.state.checked
    }
    
    return <FormControl
      className={this.props.type === "radio" || this.props.type === "checkbox" ? "cell-input" : ""}
      type={this.props.type}
      name={this.props.group}
      value={this.props.value}
      onChange={this.updateValueHandler}
      {...componentProps} />
  }
}

export default InputTableCell
