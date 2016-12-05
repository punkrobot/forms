import React from "react"
import { connect } from "react-redux"

import { ControlLabel } from "react-bootstrap"
import { FormGroup } from "react-bootstrap"
import { HelpBlock } from "react-bootstrap"

import Autosuggest from "react-autosuggest"

class RelatedField extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      value: '',
      suggestions: []
    }
  }

  getSuggestions = (value) => {
    const url = `/api/responses/?form=${this.props.question.form_id}&search=${value}`
    fetch(url, { credentials: "same-origin"} )
      .then(response => response.json())
      .then(data => {
        this.setState({ suggestions: data })
      })
      .catch(error => {
        console.log("Error: ", error)
      })
  }

  getSuggestionValue = (suggestion) => {
    const answer = suggestion.answers.filter(answer =>
      answer.answer.toLowerCase().indexOf(this.state.value.toLowerCase()) != -1
    )[0]

    this.props.dispatchUpdateAnswer(this.props.question.code, suggestion.id, answer.answer)
    this.setState({ valid: suggestion.id !== 0 })

    return answer.answer
  }

  renderSuggestion = (suggestion) => {
    const answer = suggestion.answers.filter(answer =>
      answer.answer.toLowerCase().indexOf(this.state.value.toLowerCase()) != -1
    )[0]
    return (
      <div className="suggetsion">
        {answer.answer}
      </div>
    )}

  onSuggestionsFetchRequested = ( {value} ) => {
    if (value && value.trim().length > 3) {
      this.getSuggestions(value)
    } else {
      this.setState({ suggestions: [] })
    }
  }

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    })
  }

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    })
  }

  componentDidMount() {
    this.props.dispatchUpdateValidation(this.props.question.code, true)
  }

  componentWillUnmount(){
    this.props.dispatchUpdateAnswer(this.props.question.code, "", "")
    this.props.dispatchUpdateValidation(this.props.question.code, false)
  }

  render() {
    const { value, suggestions } = this.state

    const inputProps = {
      value,
      placeholder: 'Comienza a escribir para buscar el registro ...',
      onChange: this.onChange,
      className: "form-control"
    }

    let helpText = "";
    if (this.props.question.help_text) {
      helpText = <HelpBlock>{this.props.question.help_text}</HelpBlock>
    }

    let required = ""
    if(this.props.question.required) {
      required = <span className="required">*</span>
    }

    return (
      <div className="element">
        <FormGroup
          controlId={`question${this.props.question.code}`}
          className="list-field" >

          <ControlLabel>
            {`${this.props.question.code}. ${this.props.question.question}`}
            {required}
          </ControlLabel>

          {helpText}

          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            getSuggestionValue={this.getSuggestionValue}
            renderSuggestion={this.renderSuggestion}
            inputProps={inputProps} />

        </FormGroup>
      </div>
    )
  }
}


const RelatedFieldDispatch = (dispatch) => {
  return {
    dispatchUpdateAnswer: (code, answer, label) => {
      dispatch({
        type: "update_answer",
        answer: {
          code: code,
          answer: answer,
          label: label,
          related: true
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

RelatedField = connect(null, RelatedFieldDispatch)(RelatedField)


export default RelatedField
