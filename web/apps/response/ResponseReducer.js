import update from "react-addons-update"


let initialState = {
  form: {
    id: 0,
    code: "",
    name: "",
    description: "",
    contents: {
      next_id: 1,
      questions: []
    }
  },
  response: {
    id: 0,
    answers: []
  },
  upload: [],
  status: {
    is_fetching: false,
    message: ""
  }
}


export default function responseReducer(state = initialState, action) {
  
  switch(action.type) {
    case "update_answer":
      const i = state.response.answers.findIndex(a => a.code === action.answer.code)
      let newAnswer = update(state.response.answers[i], { $merge: action.answer})
      state = update(state, {
        response: {
          answers: { $splice: [[i, 1, newAnswer]] }
        }
      })
      break
    
    case "get_form_success":
      let answers = [], validation = {}
      let addAnswer = function(code, question, answer, required, label=""){
        answers.push({
          code: code,
          question: question,
          answer: answer,
          label: label
        })
        validation[code] = { required: required };
      }
      action.form.contents.questions.forEach(function(question) {
        if (question.type === "table"){
          question.sub_questions.forEach(function(subQuestion) {
            if(question.columns.length > 1){
              question.columns.forEach(function(column) {
                if(column.type !== "check"){
                  addAnswer(subQuestion.value + column.code_suffix,
                    `${subQuestion.text} (${column.header})`, "", subQuestion.required)
                } else {
                  addAnswer(subQuestion.value + column.code_suffix,
                    `${subQuestion.text} (${column.header})`, "n", subQuestion.required, "No")
                }
              })
            } else {
              if(question.columns[0].type !== "check") {
                addAnswer(subQuestion.value, subQuestion.text, "", subQuestion.required)
              } else {
                addAnswer(subQuestion.value, subQuestion.text, "n", subQuestion.required, "No")
              }
            }
          })

        } else {
          addAnswer(question.code, question.question, "", question.required)
        }
      })
      state = update(state, {
        form: { $set: action.form },
        response: {
          answers: { $set: answers },
        },
        validation: { $set: validation },
        status: {
          is_fetching: { $set: false },
          //message: { $set: "Encuesta cargada." }
        }
      })
      break

    case "update_validation":
      let val = {}
      val[action.code] = { required: action.required }
      state = update(state, {
        validation: { $merge: val }
      })
      break

    case "get_form_error":
      state = update(state, {
        status: {
          is_fetching: { $set: false },
          message: { $set: "Error al cargar encuesta." }
        }
      })
      break

    case "post_response_success":
      state = update(state, {
        response: {
          id: { $set: action.id },
          answers: { $set: action.answers }
        },
        status: {
          is_fetching: { $set: false },
          message: { $set: "Registro guardado" }
        }
      })
      break

    case "post_response_error":
      state = update(state, {
        status: {
          is_fetching: { $set: false },
          message: { $set: "Error al guardar respuestas" }
        }
      })
      break

    case "file_upload_success":
      state = update(state, {
        status: {
          is_fetching: { $set: false },
          message: { $set: "Archivo cargado exitosamente" }
        }
      })
      break

    case "set_fetching":
      state = update(state, {
        status: {
          is_fetching: { $set: action.is_fetching }
        }
      })
      break

    case "status_update_notification":
      state = update(state, {
        status: {
          message: { $set: action.message }
        }
      })
      break

  }

  return state
}
