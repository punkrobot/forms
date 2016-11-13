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
  status: {
    last_code: 1,
    is_fetching: false,
    message: "",
    active_element: 0,
    last_action: ""
  }
}


export default function builderReducer(state = initialState, action) {

  switch(action.type) {
    case "update_name":
      state = update(state, {
        form: {
          name: { $set: action.text }
        }
      })
      break

    case "update_code":
      state = update(state, {
        form: {
          code: { $set: action.text }
        }
      })
      break

    case "update_description":
      state = update(state, {
        form: {
          description: { $set: action.text }
        }
      })
      break

    case "add_question":
      state = update(state, {
        form: {
          contents: {
            questions: { $push: [action.question] },
            next_id: { $set: action.question.key + 1 }
          }
        }
      })
      break

    case "update_question":
      const i = state.form.contents.questions.findIndex(q => q.key === action.question.key);
      state = update(state, {
        form: {
          contents: {
            questions: {$splice: [[i, 1, action.question]]}
          }
        }
      })
      break

    case "remove_question":
      const index = state.form.contents.questions.findIndex(q => q.key === action.key);
      state = update(state, {
        form: {
          contents: {
            questions: {$splice: [[index, 1]]}
          }
        }
      })
      break

    case "update_active_element":
      state = update(state, {
        status: {
          active_element: {$set: action.key}
        }
      })
      break

    case "set_fetching":
      state = update(state, {
        status: {
          is_fetching: { $set: true },
          message: { $set: "" }
        }
      })
      break

    case "get_form_success":
      state = update(state, {
        form: { $set: action.form },
        status: {
          is_fetching: { $set: false },
          message: { $set: "Encuesta cargada." }
        }
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

    case "post_form_success":
      state = update(state, {
        form: {
          id: { $set: action.id }
        },
        status: {
          is_fetching: { $set: false },
          message: { $set: "Encuesta guardada" }
        }
      })
      break

    case "post_form_error":
      state = update(state, {
        status: {
          is_fetching: { $set: false },
          message: { $set: "Error al guardar encuesta" }
        }
      })
      break

    case "status_dismiss_notification":
      state = update(state, {
        status: {
          message: { $set: "" }
        }
      })
      break
  }

  state = update(state, {
    status: {
      last_action: { $set: action.type }
    }
  })

  return state
}
