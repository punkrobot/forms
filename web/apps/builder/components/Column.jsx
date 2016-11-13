import React from "react"
import update from "react-addons-update"

import { Button } from "react-bootstrap"
import { FormControl } from "react-bootstrap"
import { FormGroup } from "react-bootstrap"
import { Glyphicon } from "react-bootstrap"

import SingleChoiceList from "./SingleChoiceList"


class Column extends React.Component {

  updateCodeSuffixHandler = (e) => {
    this.props.updateColumn(update(this.props.column, {
      code_suffix: { $set: e.target.value }
    }))
  }

  updateTypeHandler = (e) => {
    this.props.updateColumn(update(this.props.column, {
      type: { $set: e.target.value }
    }))
  }

  updateHeaderHandler = (e) => {
    this.props.updateColumn(update(this.props.column, {
      header: { $set: e.target.value },
    }))
  }

  removeColumnHandler = () =>  {
    this.props.removeColumn(this.props.column.key)
  }

  addChoiceHandler = (choice) => {
    this.props.updateColumn(update(this.props.column, {
      next_id: { $set: this.props.column.next_id + 1 },
      choices: { $push: [choice] }
    }))
  }

  updateChoiceHandler = (index, choice) => {
    this.props.updateColumn(update(this.props.column, {
      choices: { $splice: [[index, 1, choice]] }
    }))
  }

  removeChoiceHandler = (index) => {
    this.props.updateColumn(update(this.props.column, {
      choices: { $splice: [[index, 1]] }
    }))
  }

  render() {
    let choices = "", suffix = ""
    if(this.props.column.type === "radio" ||  this.props.column.type === "list") {
      choices = <div className="row">
        <div className="col-md-12">
          <SingleChoiceList
            listType="radio"
            choices={this.props.column.choices}
            next_id={this.props.column.next_id}
            addChoice={this.addChoiceHandler}
            updateChoice={this.updateChoiceHandler}
            removeChoice={this.removeChoiceHandler}
            valuePlaceholder="Valor"
            textPlaceholder="Opción"
            buttonText="Agregar opción"/>
        </div>
      </div>
    }

    if(this.props.showCodeSuffix) {
      suffix = <div className="col-md-2">
        <FormGroup>
          <FormControl
            type="text"
            placeholder="Código (sufijo)"
            defaultValue={this.props.column.code_suffix}
            onChange={this.updateCodeSuffixHandler}/>
        </FormGroup>
      </div>
    }

    return (
      <div className="column">
        <div className="row column-list">
          <div className="col-md-2">
              <FormGroup>
                <FormControl componentClass="select"
                             defaultValue={this.props.column.type} onChange={this.updateTypeHandler}>
                  <option value="radio">Radio</option>
                  <option value="text">Texto</option>
                  <option value="list">Lista</option>
                  <option value="check">Checkbox</option>
                </FormControl>
              </FormGroup>
          </div>
          {suffix}
          <div className="col-md-3">
            <FormGroup>
              <FormControl
                type="text"
                placeholder="Encabezado"
                defaultValue={this.props.column.header}
                onChange={this.updateHeaderHandler} />
            </FormGroup>
          </div>
          <div className="col-md-1">
            <Button bsStyle="link" onClick={this.removeColumnHandler} >
              <Glyphicon glyph="remove" />
            </Button>
          </div>
        </div>
        {choices}
      </div>
    )
  }
}

export default Column
