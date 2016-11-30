import React from "react"
import { connect } from "react-redux"
import update from "react-addons-update"

import { Checkbox } from "react-bootstrap"
import { ControlLabel } from "react-bootstrap"
import { FormControl } from "react-bootstrap"
import { FormGroup } from "react-bootstrap"
import { Form } from "react-bootstrap"


class FileInput extends React.Component {

  constructor(props) {
    super(props)

    this.file_types = [
      { file_type: "file", mime_type: "", label: "Archivo"},
      { file_type: "image", mime_type: "image/*", label: "Imagen"},
      { file_type: "audio", mime_type: "audio/*", label: "Audio"},
      { file_type: "video", mime_type: "video/*", label: "Video"},
      { file_type: "document", mime_type: "application/*,text/*", label: "Documento"}
    ]
  }

  updateMultipleHandler = () => {
    this.props.updateQuestion(update(this.props.question, {
      multiple: { $set: !this.props.question.multiple }
    }))
  }

  updateMimeTypeHandler = (e) => {
    let file_type = this.file_types.filter(q => q.file_type === e.target.value)[0]
    this.props.updateQuestion(update(this.props.question, {
      file_type: { $set: file_type.file_type },
      mime_type: { $set: file_type.mime_type },
      label: { $set: file_type.label }
    }))
  }

  render() {
    let types = this.file_types.map(type => {
      return <option key={type.file_type} value={type.file_type}>{type.label}</option>
    })
    return (
      <div className="file-input">
        <div className="row">
          <div className="col-md-3">
            <ControlLabel>Tipos de archivo válidos:</ControlLabel>
          </div>
          <div className="col-md-5">
            <FormGroup>
              <FormControl componentClass="select"
                           defaultValue={this.props.question.file_type}
                           onChange={this.updateMimeTypeHandler} >
                {types}
              </FormControl>
            </FormGroup>
          </div>
          <div className="col-md-4">
             <Checkbox className="pull-left"
                       defaultChecked={this.props.question.multiple}
                       onChange={this.updateMultipleHandler}>
              Múltiples archivos
            </Checkbox>
          </div>
        </div>
      </div>
    )
  }
}

const FileInputDispatch = (dispatch) => {
  return {
    updateQuestion: function(question) {
      dispatch({
        type: "update_question",
        question: question,
      })
    }
  }
}

FileInput = connect(null, FileInputDispatch)(FileInput)


export default FileInput
