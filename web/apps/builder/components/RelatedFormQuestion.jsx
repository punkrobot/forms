import React from "react"
import { connect } from "react-redux"
import update from "react-addons-update"

import { Checkbox } from "react-bootstrap"
import { ControlLabel } from "react-bootstrap"
import { FormControl } from "react-bootstrap"
import { FormGroup } from "react-bootstrap"
import { Form } from "react-bootstrap"


class RelatedFormQuestion extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      forms: []
    }
  }

  componentDidMount() {
    fetch("/api/forms/simple?format=json", { credentials: "same-origin"})
      .then(response => response.json())
      .then(data => { this.setState({forms: data}) })
      .catch(error => { console.log("Error", error) })
  }

  updateRelatedFormHandler = (e) => {
    const label = e.target.value != "0" ? e.target.options[e.target.selectedIndex].innerHTML : ""
    this.props.updateQuestion(update(this.props.question, {
      form_id: { $set: parseInt(e.target.value) },
      form_name: { $set: label }
    }))
  }

  updateMultipleHandler = () => {
    this.props.updateQuestion(update(this.props.question, {
      multiple: { $set: !this.props.question.multiple }
    }))
  }

  render() {
    let forms = this.state.forms.map(form => {
      return <option key={form.id} value={form.id}>{form.name}</option>
    })
    return (
      <div className="file-input">
        <div className="row">
          <div className="col-md-3">
            <ControlLabel>Formulario relacionado:</ControlLabel>
          </div>
          <div className="col-md-5">
            <FormGroup>
              <FormControl componentClass="select"
                           defaultValue={this.props.question.form_id}
                           onChange={this.updateRelatedFormHandler} >
                <option value="0">Selecciona un formulario...</option>
                {forms}
              </FormControl>
            </FormGroup>
          </div>
          <div className="col-md-4">
             <Checkbox className="pull-left"
                       defaultChecked={this.props.question.multiple}
                       onChange={this.updateMultipleHandler}>
              Múltiples registros
            </Checkbox>
          </div>
        </div>
      </div>
    )
  }
}

const RelatedFormQuestionDispatch = (dispatch) => {
  return {
    updateQuestion: function(question) {
      dispatch({
        type: "update_question",
        question: question,
      })
    }
  }
}

RelatedFormQuestion = connect(null, RelatedFormQuestionDispatch)(RelatedFormQuestion)


export default RelatedFormQuestion
