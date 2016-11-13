import React from "react"
import { connect } from "react-redux"
import update from "react-addons-update"

import { Button } from "react-bootstrap"
import { Checkbox } from "react-bootstrap"
import { ControlLabel } from "react-bootstrap"
import { FormControl } from "react-bootstrap"
import { FormGroup } from "react-bootstrap"
import { Glyphicon } from "react-bootstrap"


class TextQuestion extends React.Component {

  updateCodeHandler = (e) => {
    this.props.updateQuestion(update(this.props.question, {
      code: { $set: e.target.value }
    }))
  }

  updateQuestionTextHandler = (e) => {
    this.props.updateQuestion(update(this.props.question, {
      question: { $set: e.target.value }
    }))
  }

  updateHelpTextHandler = (e) => {
    this.props.updateQuestion(update(this.props.question, {
      help_text: { $set: e.target.value }
    }))
  }

  updateRequiredHandler = () => {
    this.props.updateQuestion(update(this.props.question, {
      required: { $set: !this.props.question.required }
    }))
  }

  updateConditionalHandler = () => {
    let question = update(this.props.question, {
      conditional: { $set: !this.props.question.conditional }
    })
    if(this.props.question.conditional){
      question = update(question, { condition: { $set: undefined } })
    } else {
      question = update(question, { condition: { $set: {question_key: 0, question_value: 0} } })
    }
    this.props.updateQuestion(question)
  }

  removeQuestionHandler = () => {
    this.props.removeQuestion(this.props.question.key)
  }

  onElementClickHandler = () => {
    this.props.setActiveElement(this.props.question.key)
  }

  onConditionUpdateHandler = (e) => {
    this.props.updateQuestion(update(this.props.question, {
      condition: { question_key: { $set: parseInt(e.target.value) } }
    }))
  }

  onConditionValueUpdateHandler = (e) => {
    this.props.updateQuestion(update(this.props.question, {
      condition: {question_value: {$set: e.target.value}}
    }))
  }

  render() {
    let className = "element "
    if(this.props.question.key === this.props.active){
      className += "active"
    }

    let showRequired = "", condition = ""
    if(this.props.showRequired){
      showRequired =
        <Checkbox className="pull-left" defaultChecked={this.props.question.required}
                  onChange={this.updateRequiredHandler}>
          Obligatoria
        </Checkbox>
    }

    if(this.props.question.conditional){
      let questions = this.props.questions.map(question => {
        if(question.type === "list") {
          return <option key={question.key} value={question.key}>{question.code + ". " + question.question}</option>
        }
      })

      let choices = ""
      if(this.props.question.condition.question_key != 0) {
        let question = this.props.questions.filter(q => q.key === this.props.question.condition.question_key)[0]
        choices = question.choices.map(choice => {
          return <option key={choice.key} value={choice.value}>{choice.text}</option>
        })
      }

      condition = <div className="row condition">
        <div className="col-md-2">
          <ControlLabel>Ocultar si</ControlLabel>
        </div>
        <div className="col-md-5">
          <FormGroup>
            <FormControl defaultValue={this.props.question.condition.question_key} componentClass="select"
                         onChange={this.onConditionUpdateHandler} >
              <option value="0">Selecciona una pregunta ... </option>
              {questions}
            </FormControl>
          </FormGroup>
        </div>
        <div className="col-md-2">
          <ControlLabel>Es igual a</ControlLabel>
        </div>
        <div className="col-md-3">
          <FormGroup>
            <FormControl defaultValue={this.props.question.condition.question_value} componentClass="select"
                         onChange={this.onConditionValueUpdateHandler} >
              <option value="0">Selecciona una pregunta ... </option>
              {choices}
            </FormControl>
          </FormGroup>
        </div>
      </div>
    }
    return (
      <div className={className} onClick={this.onElementClickHandler}>
        <div className="row">
          <div className="col-md-9">
            <div className="row">
              <div className="col-md-2">
                <FormGroup>
                  <FormControl
                    type="text"
                    placeholder="Código"
                    defaultValue={this.props.question.code}
                    onChange={this.updateCodeHandler} />
                </FormGroup>
              </div>
              <div className="col-md-10">
                <FormGroup>
                  <FormControl
                    type="text"
                    placeholder="Pregunta"
                    defaultValue={this.props.question.question}
                    onChange={this.updateQuestionTextHandler} />
                </FormGroup>
              </div>
            </div>
            <div className="row help-input">
              <div className="col-md-12">
                <FormGroup bsSize="small">
                  <FormControl
                    type="text"
                    placeholder="Texto de ayuda (opcional)"
                    defaultValue={this.props.question.help_text}
                    onChange={this.updateHelpTextHandler} />
                </FormGroup>
              </div>
            </div>
            {condition}
          </div>
          <div className="col-md-2">
            {showRequired}
            <Checkbox className="pull-left"
                      defaultChecked={this.props.question.conditional} onChange={this.updateConditionalHandler}>
              Condicional
            </Checkbox>
          </div>
          <div className="col-md-1">
            <Button className="pull-right" bsStyle="link" bsSize="small"
                    onClick={this.removeQuestionHandler} tabIndex="-1">
              <Glyphicon glyph="trash" />
            </Button>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}

const TextQuestionState = (state) => {
  return {
    questions: state.form.contents.questions
  }
}

const TextQuestionDispatch = (dispatch) => {
  return {
    updateQuestion: (question) => {
      dispatch({
        type: "update_question",
        question: question,
      })
    },
    removeQuestion: (key) => {
      dispatch({
        type: "remove_question",
        key: key,
      })
    },
    setActiveElement: (key) => {
      dispatch({
        type: "update_active_element",
        key: key,
      })
    }
  }
}

TextQuestion = connect(TextQuestionState, TextQuestionDispatch)(TextQuestion)


export default TextQuestion
