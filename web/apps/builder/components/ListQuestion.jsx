import React from "react"
import { connect } from "react-redux"
import update from "react-addons-update"

import SingleChoiceList from "./SingleChoiceList"


class ListQuestion extends React.Component {

  addChoiceHandler = (choice) => {
    this.props.updateQuestion(update(this.props.question, {
      next_id: { $set: this.props.question.next_id + 1 },
      choices: { $push: [choice] }
    }))
  }

  updateChoiceHandler = (index, choice) => {
    this.props.updateQuestion(update(this.props.question, {
      choices: { $splice: [[index, 1, choice]] }
    }))
  }

  removeChoiceHandler = (index) => {
    this.props.updateQuestion(update(this.props.question, {
      choices: { $splice: [[index, 1]] }
    }))
  }

  render() {
    return (
      <div className="list-question">
        <SingleChoiceList
          listType="radio"
          choices={this.props.question.choices}
          next_id={this.props.question.next_id}
          addChoice={this.addChoiceHandler}
          updateChoice={this.updateChoiceHandler}
          removeChoice={this.removeChoiceHandler}
          valuePlaceholder="Valor"
          textPlaceholder="Opción"
          buttonText="Agregar opción" />
      </div>
    )
  }
}

const ListQuestionInputDispatch = (dispatch) => {
  return {
    updateQuestion: function(question) {
      dispatch({
        type: "update_question",
        question: question,
      })
    }
  }
}

ListQuestion = connect(null, ListQuestionInputDispatch)(ListQuestion)


export default ListQuestion
