import React from "react"
import { connect } from "react-redux"

import { ControlLabel } from "react-bootstrap"
import { FormGroup } from "react-bootstrap"
import { HelpBlock } from "react-bootstrap"
import { Table } from "react-bootstrap"

import InputTableCell  from "./InputTableCell"
import SelectTableCell from "./SelectTableCell"


class TableField extends React.Component {
  
  updateAnswerHandler = (answer) => {
    this.props.dispatchUpdateAnswer(answer)
  }
  
  render() {
    /* Main headers, if a column is type radio or list span the column accordingly */
    let columnHeaders =
      <tr>
        <th/>{this.props.question.columns.map(column => {
          let colSpan = 0
          if(column.type === "radio" || column.type === "list"){
            colSpan = column.choices.length
          }
          return <th key={column.key} colSpan={colSpan}>{column.header}</th>
        })}
      </tr>

    /* If any column is type radio get the secondary headers from the column choices */
    let hasColumnChoices = this.props.question.columns.some(column => {
      return column.type === "radio"
    })
    let columnChoicesHeaders =
      <tr>
        <th/>{this.props.question.columns.map(column => {
          if(column.type === "radio") {
            return column.choices.map(choice => {
              return <th key={`${column.key}.${choice.key}`}>{choice.text}</th>
            })
          } else {
            return <th key={column.key}/>
          }
        })}
      </tr>

    /* Table rows */
    let subQuestions = this.props.question.sub_questions.map(subQuestion => {
      let columnChoicesValues = this.props.question.columns.map(column => {
        if(column.type === "text") {
          return <td key={column.key}>
            <InputTableCell type="input" code={subQuestion.value+column.code_suffix}
                            updateAnswer={this.updateAnswerHandler}  />
          </td>

        } else if(column.type === "list"){
          return <td key={column.key}>
            <SelectTableCell code={subQuestion.value+column.code_suffix} choices={column.choices}
                             updateAnswer={this.updateAnswerHandler} />
          </td>

        } else if(column.type === "radio"){
          return column.choices.map(choice => {
            let group = `radio${this.props.question.key}.${subQuestion.key}.${column.key}`
            return <td key={`${column.key}.${choice.key}`}>
              <InputTableCell type="radio" code={subQuestion.value+column.code_suffix}
                              group={group} value={choice.value} label={choice.text}
                              updateAnswer={this.updateAnswerHandler} />
            </td>
          })

        } else if(column.type === "check"){
          return <td key={column.key}>
            <InputTableCell type="checkbox" code={subQuestion.value+column.code_suffix}
                            updateAnswer={this.updateAnswerHandler} />
          </td>
        }
      })

      let required = " "
      if(subQuestion.required) {
        required = <span className="required">*</span>
      }

      return <tr key={subQuestion.key}>
        <td className="sub-question">{`${subQuestion.value}. ${subQuestion.text}`}{required}</td>{columnChoicesValues}
      </tr>
    })

    let helpText = "";
    if (this.props.question.help_text) {
      helpText = <HelpBlock>{this.props.question.help_text}</HelpBlock>
    }

    return (
      <div className="element">
        <FormGroup>
          <ControlLabel>{`${this.props.question.code}. ${this.props.question.question}`}</ControlLabel>
          {helpText}
          <Table striped hover>
            <thead>
              {columnHeaders}
              {hasColumnChoices ? columnChoicesHeaders : null}
            </thead>
            <tbody>
              {subQuestions}
            </tbody>
          </Table>
        </FormGroup>
      </div>
    )
  }
}


const TableFieldDispatch = (dispatch) => {
  return {
    dispatchUpdateAnswer: (answer) => {
      dispatch({
        type: "update_answer",
        answer: answer,
      })
    }
  }
}

TableField = connect(null, TableFieldDispatch)(TableField)


export default TableField
