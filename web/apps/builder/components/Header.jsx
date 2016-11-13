import React from "react"
import { connect } from "react-redux"
import update from "react-addons-update"

import { Button } from "react-bootstrap"
import { FormControl } from "react-bootstrap"
import { FormGroup } from "react-bootstrap"
import { Glyphicon } from "react-bootstrap"


class Header extends React.Component {

  updateHeaderTextHandler = (e) => {
    this.props.updateQuestion(update(this.props.question, {
      header: { $set: e.target.value }
    }))
  }

  removeQuestionHandler = () => {
    this.props.removeQuestion(this.props.question.key)
  }

  render() {
    return (
      <div className="element">
        <div className="row header">
          <div className="col-md-9">
            <div className="row">
              <div className="col-md-12">
                <FormGroup bsSize="large">
                  <FormControl
                    type="text"
                    placeholder="Encabezado"
                    defaultValue={this.props.question.header}
                    onChange={this.updateHeaderTextHandler} />
                </FormGroup>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <Button className="pull-right" bsStyle="link" bsSize="small" onClick={this.removeQuestionHandler} tabIndex="-1">
              <Glyphicon glyph="trash" />
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

const HeaderDispatch = (dispatch) => {
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
    }
  }
}

Header = connect(null, HeaderDispatch)(Header)

export default Header
