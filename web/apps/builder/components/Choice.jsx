import React from "react"
import update from "react-addons-update"

import { Button } from "react-bootstrap"
import { Checkbox } from "react-bootstrap"
import { FormControl } from "react-bootstrap"
import { FormGroup } from "react-bootstrap"
import { Glyphicon } from "react-bootstrap"


class Choice extends React.Component {
  
  updateValueHandler = (e) => {
    this.props.updateChoice(update(this.props.choice, {
      value: { $set: e.target.value }
    }))
  }
  
  updateTextHandler = (e) => {
    this.props.updateChoice(update(this.props.choice, {
      text: { $set: e.target.value }
    }))
  }
  
  updateRequiredHandler = () => {
    this.props.updateChoice(update(this.props.choice, {
      required: { $set: !this.props.choice.required }
    }))
  }
  
  removeChoiceHandler = () => {
    this.props.removeChoice(this.props.choice.key)
  }
  
  render() {
    let type = ""
    if(this.props.choiceType === "check"){
      type =
        <div className="col-md-1">
          <input className="choice-list-element" type="checkbox" value="n" disabled />
        </div>
    } else if(this.props.choiceType === "radio"){
      type =
        <div className="col-md-1">
          <input className="choice-list-element" type="radio" value="n" disabled />
        </div>
    }
    
    let showRequired = ""
    if(this.props.showRequired){
      showRequired =
        <div className="col-md-2">
          <Checkbox className="pull-left"
                    defaultChecked={this.props.choice.required}
                    onChange={this.updateRequiredHandler}>
            Obligatoria
          </Checkbox>
        </div>
    }
    
    return (
      <div className="choice">
        <div className="row">
          { type }
          <div className="col-md-2">
            <FormGroup>
              <FormControl
                type="text"
                placeholder={this.props.valuePlaceholder}
                defaultValue={this.props.choice.value}
                onChange={this.updateValueHandler} />
            </FormGroup>
          </div>
          <div className="col-md-5">
            <FormGroup>
              <FormControl
                type="text"
                placeholder={this.props.textPlaceholder}
                defaultValue={this.props.choice.text}
                onChange={this.updateTextHandler} />
            </FormGroup>
          </div>
          {showRequired}
          <div className="col-md-1">
            <Button bsStyle="link" onClick={this.removeChoiceHandler} tabIndex="-1" >
              <Glyphicon glyph="remove" />
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

export default Choice
