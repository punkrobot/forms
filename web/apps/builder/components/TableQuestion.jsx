import React from "react"
import { connect } from "react-redux"
import update from "react-addons-update"

import { Button } from "react-bootstrap"
import { Glyphicon } from "react-bootstrap"

import SingleChoiceList from "./SingleChoiceList"
import Column from "./Column"


class TableQuestion extends React.Component {

  addSubQuestion = (subQuestion) => {
    this.props.updateQuestion(update(this.props.question, {
      next_sub_question_id: { $set: this.props.question.next_sub_question_id + 1 },
      sub_questions: { $push: [subQuestion] }
    }))
  }

  updateSubQuestion = (index, subQuestion) => {
    this.props.updateQuestion(update(this.props.question, {
      sub_questions: { $splice: [[index, 1, subQuestion]] }
    }))
  }

  removeSubQuestion = (index) => {
    this.props.updateQuestion(update(this.props.question, {
      sub_questions: { $splice: [[index, 1]] }
    }))
  }

  addColumnHandler = () => {
    var column = {
      key: this.props.question.next_column_id,
      code_suffix: "",
      type: "radio",
      header: "",
      next_id: 2,
      choices: [{
        key: 1,
        value: "",
        text: ""
      }]
    }
    this.props.updateQuestion(update(this.props.question, {
      next_column_id: { $set: this.props.question.next_column_id + 1 },
      columns: { $push: [column] }
    }))
  }

  updateColumnHandler = (column) => {
    this.props.updateQuestion(update(this.props.question, {
      columns: { $splice: [[this.props.question.columns.findIndex(c => c.key === column.key), 1, column]] }
    }))
  }

  removeColumnHandler = (key) => {
    this.props.updateQuestion(update(this.props.question, {
      columns: { $splice: [[this.props.question.columns.findIndex(c => c.key === key), 1]] }
    }))
  }

  render() {
    const showCodeSuffix = this.props.question.columns.length > 1;
    let columns = this.props.question.columns.map(column => {
      return <Column
        key={column.key}
        column={column}
        showCodeSuffix={showCodeSuffix}
        updateColumn={this.updateColumnHandler}
        removeColumn={this.removeColumnHandler}/>
    })
    return (
      <div className="table-question">
        <div className="row">
          <div className="col-md-12">
            <h4>Sub-preguntas</h4>
            <SingleChoiceList
              listType="simple"
              choices={this.props.question.sub_questions}
              next_id={this.props.question.next_sub_question_id}
              addChoice={this.addSubQuestion}
              updateChoice={this.updateSubQuestion}
              removeChoice={this.removeSubQuestion}
              valuePlaceholder="Código"
              textPlaceholder="Sub-pregunta"
              showRequired={true}
              buttonText="Agregar sub-pregunta" />
          </div>
        </div>
        <div className="row">
          <div className="col-md-9">
            <h4>Columnas</h4>
          </div>
          <div className="col-md-3">
            <Button onClick={this.addColumnHandler}>
              <Glyphicon glyph="plus" /> Agregar columna
            </Button>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            {columns}
          </div>
        </div>
      </div>
    )
  }
}

const TableQuestionDispatch = (dispatch) => {
  return {
    updateQuestion: function(question) {
      dispatch({
        type: "update_question",
        question: question,
      })
    }
  }
}

TableQuestion = connect(null, TableQuestionDispatch)(TableQuestion)


export default TableQuestion
