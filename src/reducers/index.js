import { combineReducers } from 'redux'
import { todos, order } from './todos'

const rootReducer = combineReducers({
  todos,
  order
})

export default rootReducer