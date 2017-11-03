import * as types from './ActionTypes'


//addTodo
export const addTodo = (text) => ({
	type: types.ADD_TODO,
	text
})

//deleteTodo
export const deleteTodo = id  => ({
	type: types.DELETE_TODO,
	id,
})

//eidtTodo
export const editTodo = (id, text) => ({
	type: types.EDIT_TODO, 
	id, 
	text
})

//removeTodo
export const removeTodo = (id, text) => ({
	type: types.REMOVE_TODO,
	id,
	text
})

//changeOrder 
export const changeOrder = (order) => ({
	type: types.CHANGE_ORDER,
	order
})
