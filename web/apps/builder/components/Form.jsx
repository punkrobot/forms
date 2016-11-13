import React from "react"
import { connect } from "react-redux"

import { Button } from "react-bootstrap"
import { ButtonToolbar } from "react-bootstrap"
import { ButtonGroup } from "react-bootstrap"
import { Glyphicon } from "react-bootstrap"
import { Notification } from "react-notification"

import TextField from "./../../shared/TextField"
import Header from "./Header"
import TextQuestion from "./TextQuestion"
import ListQuestion from "./ListQuestion"
import TableQuestion from "./TableQuestion"
import Utils from "./../../shared/Utils"


class Form extends React.Component {

  getForm() {
    this.props.dispatchSetFetching()

    const url = `/api/forms/${form_id}/?format=json`

    fetch(url, { credentials: "same-origin"})
      .then(response => response.json())
      .then(data => this.props.dispatchGetFormSuccess(data))
      .catch(error => this.props.dispatchGetFormError())
  }

  postForm = () => {
    this.props.dispatchSetFetching()
    const newForm = this.props.form.id === 0,
      url = newForm ? "/api/forms/" : `/api/forms/${this.props.form.id}/`

    fetch(url, {
      method: newForm ? "POST" : "PUT",
      credentials: "same-origin",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": Utils.getCookie("csrftoken")
      },
      body: JSON.stringify(this.props.form)
    }).then(response => response.json())
      .then(data => this.props.dispatchPostFormSuccess(data.id))
      .catch(error => this.props.dispatchPostFormError())
  }

  getNewQuestion(type) {
    return {
      key: this.props.form.contents.next_id,
      code: "",
      type: type,
      question: "",
      help_text: "",
      required: true,
      conditional: false
    }
  }

  addTextQuestionHandler = () => {
    this.props.dispatchAddQuestion(this.getNewQuestion("text"))
  }

  addListQuestionHandler = () => {
    let question = this.getNewQuestion("list")
    question.next_id = 2
    question.choices = [{
      key: 1,
      value: "",
      text: ""
    }]
    this.props.dispatchAddQuestion(question)
  }

  addTableQuestionHandler = () => {
    let question = this.getNewQuestion("table")
    question.next_sub_question_id = 2
    question.next_column_id = 2
    question.sub_questions = [{ key: 1, value: "", text: "", required: true }]
    question.columns = [{
      key: 1,
      code_suffix: "",
      type: "list",
      header: "",
      next_id: 2,
      choices: [{ key: 1, value: "", text: ""}]
    }]
    this.props.dispatchAddQuestion(question)
  }

  addHeaderHandler = () => {
    this.props.dispatchAddQuestion({
      key: this.props.form.contents.next_id,
      code: "",
      type: "header",
      header: ""
    })
  }

  dismissNotificationHandler = () => {
    this.props.dispatchDismissNotifications()
  }

  updateTextHandler = (code, text) => {
    this.props.dispatchUpdateText(`update_${code}`, text)
  }

  componentDidMount() {
    if(form_id !== 0) {
      this.getForm()
    }
  }

  componentDidUpdate() {
    if(this.props.status.last_action === "add_question"){
      this.refs.buttonBar.scrollIntoView()
    }
  }

  render() {
    var questions = this.props.form.contents.questions.map(question => {
      if(question.type === "header") {
        return <Header key={question.key} question={question} />

      } else if(question.type === "text") {
        return <TextQuestion
          key={question.key}
          question={question}
          active={this.props.status.active_element}
          showRequired />

      } else if(question.type === "list") {
        return(
          <TextQuestion key={question.key} question={question} showRequired>
            <ListQuestion question={question} />
          </TextQuestion>
        )

      } else if(question.type === "table") {
        return(
          <TextQuestion key={question.key} question={question}>
            <TableQuestion question={question} />
          </TextQuestion>
        )

      } else {
        return ""
      }
    })
    return (
      <div className="form-builder">
        <TextField code="name" size="large" label="Nombre"
                   text={this.props.form.name} updateText={this.updateTextHandler} />

        <TextField code="description" label="Descripción"
                   text={this.props.form.description} textarea updateText={this.updateTextHandler} />

        {questions}

        <div ref="buttonBar" className="form-footer">
          <ButtonToolbar>
            <ButtonGroup>
              <Button bsStyle="primary" onClick={this.addTextQuestionHandler}><Glyphicon glyph="font" /> Texto</Button>
              <Button bsStyle="primary" onClick={this.addListQuestionHandler}><Glyphicon glyph="list" /> Lista</Button>
              <Button bsStyle="primary" onClick={this.addTableQuestionHandler}><Glyphicon glyph="th" /> Tabla</Button>
            </ButtonGroup>
            <ButtonGroup>
              <Button bsStyle="primary" onClick={this.addHeaderHandler}><Glyphicon glyph="header" /> Encabezado</Button>
            </ButtonGroup>
            <ButtonGroup className="pull-right">
              <Button disabled={this.props.status.is_fetching}
                      onClick={!this.props.status.is_fetching ? this.postForm : null} >
                {this.props.status.is_fetching ? "Guardando..." : "Guardar"}
              </Button>
            </ButtonGroup>
          </ButtonToolbar>
        </div>
        <Notification
          isActive={this.props.status.message.length > 0}
          message={this.props.status.message}
          onDismiss={this.dismissNotificationHandler} />
      </div>
    )
  }
}

const FormState = (state) => {
  return {
    form: state.form,
    status: state.status
  }
}

const FormDispatch = (dispatch) => {
  return {
    dispatchUpdateText: (event, text) => {
      dispatch({
        type: event,
        text: text
      })
    },
    dispatchAddQuestion: (question) => {
      dispatch({
        type: "add_question",
        question: question,
      })
    },
    dispatchGetFormSuccess: (form) => {
      dispatch({
        type: "get_form_success",
        form: form
      })
    },
    dispatchGetFormError: () => {
      dispatch({ type: "get_form_error" })
    },
    dispatchPostFormSuccess: (id) => {
      dispatch({
        type: "post_form_success",
        id: id
      })
    },
    dispatchPostFormError: () => {
      dispatch({ type: "post_form_error" })
    },
    dispatchSetFetching: () => {
      dispatch({ type: "set_fetching" })
    },
    dispatchDismissNotifications: () => {
      dispatch({ type: "status_dismiss_notification" })
    }
  }
}

Form = connect(FormState, FormDispatch)(Form)


export default Form
