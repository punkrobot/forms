import React from "react"
import { connect } from "react-redux"

import { Button } from "react-bootstrap"
import { Notification } from "react-notification"

import TextField from "./../../shared/TextField"
import ListField from "./ListField"
import TableField from "./TableField"
import Utils from "./../../shared/Utils"


class FormResponse extends React.Component {

  getForm() {
    this.props.dispatchSetFetching()

    fetch(`/api/forms/${form_id}/?format=json`, { credentials: "same-origin"})
      .then(response => response.json())
      .then(data => this.props.dispatchGetSurveySuccess(data))
      .catch(error => this.props.dispatchGetSurveyError())
  }

  componentDidMount() {
    if(form_id !== 0) {
      this.getForm()
    }
  }

  validateForm() {
    var validation = this.props.validation
    return !this.props.response.answers.some(function(answer) {
      var value = answer.answer.trim()
      return answer.code in validation && validation[answer.code].required
        && ( value === "" || value === "0" )
    })
  }

  postFormResponse = () => {
    if(!this.validateForm()) {
      this.props.dispatchShowNotifications("Error. Capture los campos obligatorios.")
      return
    }

    this.props.dispatchSetFetching()

    let newFormResponse = this.props.response.id === 0,
      url = newFormResponse ? "/api/responses/" : `/api/responses/${this.props.response.id}/`

    var responseData = {
      id: this.props.response.id,
      form: this.props.form.id,
      answers: this.props.response.answers
    }
    fetch(url, {
      method: newFormResponse ? "POST" : "PUT",
      credentials: "same-origin",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": Utils.getCookie("csrftoken")
      },
      body: JSON.stringify(responseData)
    }).then(response => response.json())
      .then(data => this.props.dispatchPostSurveyResponseSuccess(data))
      .catch(error => this.props.dispatchPostSurveyResponseError())
  }

  dismissNotificationHandler = () => {
    this.props.dispatchDismissNotifications()
  }

  updateTextHandler = (code, text) => {
    this.props.dispatchUpdateAnswer({
      code: code,
      answer: text
    })
  }

  render() {
    var questions = this.props.form.contents.questions.map(question => {
      if(question.conditional){
        let answer = this.props.response.answers.filter(answer => answer.code == question.condition.question_key)[0]
        if(answer && question.condition.question_value === answer.answer){
          return
        }
      }
      if (question.type === "header") {
        return <div key={question.key} className="element">
          <h3>{question.header}</h3>
        </div>

      } else if (question.type === "text") {
        return <TextField
          key={question.key}
          code={question.code}
          label={question.question}
          helpText={question.help_text}
          required={question.required}
          updateText={this.updateTextHandler}
          showCode/>

      } else if (question.type === "list") {
        return <ListField key={question.key} question={question}/>

      } else if (question.type === "table") {
        return <TableField key={question.key} question={question}/>

      }
    })
    return (
      <div>
        {questions}
        <div className="form-footer clearfix">
          <Button bsStyle="primary" className="pull-right" disabled={this.props.status.is_fetching}
                  onClick={this.postFormResponse} >Enviar</Button>
        </div>
        <Notification
          isActive={this.props.status.message.length > 0}
          message={this.props.status.message}
          onDismiss={this.dismissNotificationHandler} />
      </div>
    )
  }
}

const FormResponseState = (state) => {
  return {
    form: state.form,
    response: state.response,
    validation: state.validation,
    status: state.status
  }
}

const FormResponseDispatch = (dispatch) => {
  return {
    dispatchUpdateAnswer: (answer) => {
      dispatch({
        type: "update_answer",
        answer: answer
      })
    },
    dispatchGetSurveySuccess: (form) => {
      dispatch({
        type: "get_form_success",
        form: form
      })
    },
    dispatchGetSurveyError: () => {
      dispatch({ type: "get_form_error" })
    },
    dispatchPostSurveyResponseSuccess: (id, answers) => {
      dispatch({
        type: "post_response_success",
        id: id,
        answers: answers
      })
    },
    dispatchPostSurveyResponseError: () => {
      dispatch({ type: "post_response_error" })
    },
    dispatchSetFetching: () => {
      dispatch({ type: "set_fetching" })
    },
    dispatchShowNotifications: (message) => {
      dispatch({ type: "status_show_notification", message: message })
    },
    dispatchDismissNotifications: () => {
      dispatch({ type: "status_dismiss_notification" })
    }
  }
}

FormResponse = connect(FormResponseState, FormResponseDispatch)(FormResponse)


export default FormResponse
