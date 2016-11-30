import React from "react"
import { connect } from "react-redux"

import { ControlLabel } from "react-bootstrap"
import { FormControl } from "react-bootstrap"
import { FormGroup } from "react-bootstrap"
import { HelpBlock } from "react-bootstrap"


class ListField extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = { valid: true }
  }

  componentDidMount() {
    this.props.dispatchUpdateValidation(this.props.question.code, true)
  }
  
  componentWillUnmount(){
    this.props.dispatchUpdateAnswer(this.props.question.code, "", "")
    this.props.dispatchUpdateValidation(this.props.question.code, false)
  }
  
  updateAnswerHandler = (e) => {
    const label = e.target.options[e.target.selectedIndex].innerHTML
    this.props.dispatchUpdateAnswer(this.props.question.code, e.target.value, label)
    this.setState({ valid: e.target.value !== "0" })
  }

  render() {
    let choices = this.props.question.choices.map(choice => {
      return <option key={choice.key} value={choice.value}>{choice.text}</option>
    })

    let helpText = "";
    if (this.props.question.help_text) {
      helpText = <HelpBlock>{this.props.question.help_text}</HelpBlock>
    }

    let required = ""
    if(this.props.question.required) {
      required = <span className="required">*</span>
    }

    let groupComponentProps = {}
    if (this.props.question.required && !this.state.valid){
      groupComponentProps.validationState = "error"
    }

    return (
      <div className="element">
        <FormGroup
          controlId={`question${this.props.question.code}`}
          className="list-field"
          {...groupComponentProps} >

          <ControlLabel>
            {`${this.props.question.code}. ${this.props.question.question}`}
            {required}
          </ControlLabel>

          {helpText}

          <FormControl componentClass="select" onChange={this.updateAnswerHandler}>
            <option value="0">Selecciona una opción ... </option>
            {choices}
          </FormControl>

        </FormGroup>
      </div>
    )
  }
}


const ListFieldDispatch = (dispatch) => {
  return {
    dispatchUpdateAnswer: (code, answer, label) => {
      dispatch({
        type: "update_answer",
        answer: {
          code: code,
          answer: answer,
          label: label
        }
      })
    },
    dispatchUpdateValidation: (code, required) => {
      dispatch({
        type: "update_validation",
        code: code,
        required: required
      })
    }
  }
}

ListField = connect(null, ListFieldDispatch)(ListField)


export default ListField
