import React from "react"

import { Button } from "react-bootstrap"
import { Glyphicon } from "react-bootstrap"

import Choice from "./Choice"


class SingleChoiceList extends React.Component {

  addChoiceHandler = () => {
    let choice = {
      key: this.props.next_id,
      value: "",
      text: ""
    }
    if(this.props.showRequired){
      choice["required"] = true
    }
    this.props.addChoice(choice)
  }

  updateChoiceHandler = (choice) => {
    this.props.updateChoice(this.props.choices.findIndex(c => c.key === choice.key), choice)
  }

  removeChoiceHandler = (key) => {
    this.props.removeChoice(this.props.choices.findIndex(c => c.key === key))
  }

  render() {
    let choices = this.props.choices.map(choice => {
      return <Choice
        key={choice.key}
        choice={choice}
        choiceType={this.props.listType}
        updateChoice={this.updateChoiceHandler}
        removeChoice={this.removeChoiceHandler}
        valuePlaceholder={this.props.valuePlaceholder}
        textPlaceholder={this.props.textPlaceholder}
        showRequired={this.props.showRequired} />
    })
    return (
      <div className="choice-list">
        <div className="row">
          <div className="col-md-9">
            {choices}
          </div>
          <div className="col-md-3">
            <Button onClick={this.addChoiceHandler}>
              <Glyphicon glyph="plus" /> {this.props.buttonText}
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

export default SingleChoiceList
