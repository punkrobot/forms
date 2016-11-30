import React from "react"
import { connect } from "react-redux"
import update from "react-addons-update"

import { ControlLabel } from "react-bootstrap"
import { FormControl } from "react-bootstrap"
import { FormGroup } from "react-bootstrap"
import { HelpBlock } from "react-bootstrap"
import { Glyphicon } from "react-bootstrap"

import Dropzone from "react-dropzone"


class FileInputField extends React.Component {

  constructor(props) {
    super(props)
    this.state = { valid: true, files: [] }
  }

  componentDidMount() {
    this.props.dispatchUpdateValidation(this.props.question.code, true)
  }

  componentWillUnmount(){
    this.props.dispatchUpdateAnswer(this.props.question.code, "", "")
    this.props.dispatchUpdateValidation(this.props.question.code, false)
  }

  onDropHandler = (acceptedFiles) => {
    if(acceptedFiles && acceptedFiles.length > 0){
      this.setState(update(this.state, {
        files: { $set: acceptedFiles },
        valid: { $set: true }
      }))
      this.props.dispatchUpdateAnswer(this.props.question.code,
        this.props.question.file_type, this.props.question.label)
    }
  }

  render() {
    let helpText = "";
    if (this.props.question.help_text) {
      helpText = <HelpBlock>{this.props.question.help_text}</HelpBlock>
    }

    let required = ""
    if(this.props.question.required) {
      required = <span className="required">*</span>
    }

    let groupComponentProps = {}
    if (this.props.question.required && !this.state.valid){
      groupComponentProps.validationState = "error"
    }

    let files = <span className="text-muted">
      Arrastra archivos en ésta área o da clic para seleccionarlos.
    </span>
    if(this.state.files.length > 0) {
      files = this.state.files.map(file => {
        if (this.props.question.file_type === "image") {
          return (
            <div key={file.name} className="col-md-3">
              <img className="thumbnail img-responsive" src={file.preview}/>
              <span>{file.name}</span>
            </div>
          )
        } else {
          return (
            <div key={file.name} className="col-md-3">
              <Glyphicon glyph="file" /> {file.name}
            </div>
          )
        }
      })
    }

    return (
      <div className="element">
        <FormGroup
          controlId={`question${this.props.question.code}`}
          className="file-input-field"
          {...groupComponentProps} >

          <ControlLabel>
            {`${this.props.question.code}. ${this.props.question.question}`}
            {required}
          </ControlLabel>

          {helpText}

          <Dropzone className={"dropzone"} activeClassName={"active-dropzone"}
                    multiple={this.props.question.multiple} accept={this.props.question.mime_type}
                    onDrop={this.onDropHandler}>
            <div className="text-center">
              <div className="row">
                {files}
              </div>
            </div>
          </Dropzone>

        </FormGroup>
      </div>
    )
  }
}


const FileInputFieldDispatch = (dispatch) => {
  return {
    dispatchUpdateAnswer: (code, answer, label) => {
      dispatch({
        type: "update_answer",
        answer: {
          code: code,
          answer: answer,
          label: label
        }
      })
    },
    dispatchUpdateValidation: (code, required) => {
      dispatch({
        type: "update_validation",
        code: code,
        required: required
      })
    }
  }
}

FileInputField = connect(null, FileInputFieldDispatch, null, {withRef: true})(FileInputField)


export default FileInputField
