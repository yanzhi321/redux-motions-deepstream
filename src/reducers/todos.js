import { ADD_TODO, DELETE_TODO, EDIT_TODO, REMOVE_TODO, CHANGE_ORDER } from '../actions/ActionTypes'


//initialTodos
const initialTodos = [{
	text: 'To Be No One',
	id: 0
}, {
	text: 'Please Try It',
	id: 1
}, {
	text: 'Never Escape reality',
	id: 2
}, {
	text: 'Do Mutual Trust',
	id: 3
}]

//return new State
export const todos = (state = initialTodos, action) => {
	switch(action.type) {
		case ADD_TODO:
			return [...state,{
				text: action.text,
				id: state.length !== 0 ? (Math.max(...state.map(i => i.id)) + 1) : 0
				}
			]
		case DELETE_TODO:
			return state.filter(item =>
				item.id !== action.id
			)
		case EDIT_TODO:
			return state.map(item =>
				item.id === action.id ? {
					...item,
					text: action.text
				} : item
			)
		
		case REMOVE_TODO:
			return state = []
		default:
			return state
	}
}

//return new Order
export const order = (state = [0,1,2,3], action) => {
	switch(action.type) {
		case CHANGE_ORDER:
			return action.order
		default:
			return state
	}
}

