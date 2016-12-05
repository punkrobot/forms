import React from "react"
import { connect } from "react-redux"

import { Button } from "react-bootstrap"
import { Notification } from "react-notification"

import TextField from "./../../shared/TextField"
import ListField from "./ListField"
import TableField from "./TableField"
import FileInputField from "./FileInputField"
import RelatedField from "./RelatedField"
import Utils from "./../../shared/Utils"


class FormResponse extends React.Component {

  getForm() {
    this.props.dispatchUpdateFetching(true)

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
    let validation = this.props.validation
    return !this.props.response.answers.some(function(answer) {
      let value = answer.answer.trim()
      return answer.code in validation && validation[answer.code].required
        && ( value === "" || value === "0" )
    })
  }

  postFormResponse = () => {
    /*if(!this.validateForm()) {
      this.props.dispatchShowNotifications("Error. Capture los campos obligatorios.")
      return
    }*/

    this.props.dispatchUpdateFetching(true)

    let newFormResponse = this.props.response.id === 0,
      url = newFormResponse ? "/api/responses/" : `/api/responses/${this.props.response.id}/`

    const responseData = {
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
      .then(this.postFormFiles)
      .catch(error => this.props.dispatchPostSurveyResponseError())

  }

  postFormFiles = () => {
    this.props.form.contents.questions.forEach(question => {
      if(question.type === "file") {
        this.props.dispatchUpdateFetching(true)
        const answer = this.props.response.answers.filter(answer => answer.code === question.code)[0]

        this.refs[`file${question.key}`].getWrappedInstance().state.files.forEach(file => {
          let data = new FormData()
          data.append('file', file)
          data.append('response', answer.id)

          fetch("/api/files/", {
            method: "POST",
            credentials: "same-origin",
            headers: {
              "Accept": "application/json",
              "X-CSRFToken": Utils.getCookie("csrftoken")
            },
            body: data
          }).then(response => response.json())
            .then(data => this.props.dispatchFileUploadSuccess())
            .catch(error => this.props.dispatchPostSurveyResponseError())
        })
      }
    })
  }

  dismissNotificationHandler = () => {
    this.props.dispatchUpdateNotification("")
  }

  updateTextHandler = (code, text) => {
    this.props.dispatchUpdateAnswer({
      code: code,
      answer: text
    })
  }

  render() {
    let questions = this.props.form.contents.questions.map(question => {
      if(question.conditional){
        let answer = this.props.response.answers.filter(
          answer => answer.code == question.condition.question_key
        )[0]
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

      } else if (question.type === "file") {
        return <FileInputField ref={`file${question.key}`} key={question.key} question={question}/>

      } else if (question.type === "related") {
        return <RelatedField key={question.key} question={question}/>

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
          dismissAfter={3000}
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
    dispatchPostSurveyResponseSuccess: (data) => {
      dispatch({
        type: "post_response_success",
        id: data.id,
        answers: data.answers
      })
    },
    dispatchPostSurveyResponseError: () => {
      dispatch({ type: "post_response_error" })
    },
    dispatchFileUploadSuccess: () => {
      dispatch({ type: "file_upload_success" })
    },
    dispatchUpdateFetching: (isFetching) => {
      dispatch({ type: "set_fetching", is_fetching: isFetching })
    },
    dispatchUpdateNotification: (message) => {
      dispatch({ type: "status_update_notification", message: message })
    }
  }
}

FormResponse = connect(FormResponseState, FormResponseDispatch)(FormResponse)


export default FormResponse
