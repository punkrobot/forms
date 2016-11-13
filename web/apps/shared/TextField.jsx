import React from "react"

import { ControlLabel } from "react-bootstrap"
import { FormControl } from "react-bootstrap"
import { FormGroup } from "react-bootstrap"
import { HelpBlock } from "react-bootstrap"


class TextField extends React.Component {

  constructor(props) {
    super(props)
    this.state = { valid: true }
  }

  updateTextHandler = (e) => {
    this.props.updateText(this.props.code, e.target.value)
    this.setState({ valid: e.target.value.trim().length !== 0 })
  }

  render() {
    let componentProps = {}
    if (this.props.textarea) {
      componentProps.componentClass = "textarea"
    }

    let groupComponentProps = {};
    if (this.props.required && !this.state.valid){
      groupComponentProps.validationState = "error"
    }

    let helpText = ""
    if (this.props.helpText) {
      helpText = <HelpBlock>{this.props.helpText}</HelpBlock>
    }

    let label = this.props.label
    if(this.props.showCode && this.props.code){
      label = this.props.code + ". " + label
    }

    let required = ""
    if(this.props.required) {
      required = <span className="required">*</span>
    }

    return (
      <div className="element">
        <FormGroup
          controlId={"question"+this.props.code}
          className="text-question"
          bsSize={this.props.size}
          {...groupComponentProps} >

          <ControlLabel>{label}{required}</ControlLabel>

          {helpText}

          <FormControl
            type="text"
            value={this.props.text}
            onChange={this.updateTextHandler}
            {...componentProps} />

        </FormGroup>
      </div>
    )
  }
}


export default TextField
