//只能有一个store// 一个应用只有一个Store。一个应用只有一个Store。一个应用只有一个Store。

// 重要的事情放在前面说，而且说三遍。。

// 上面章节中，我们学会了使用 action 来描述“发生了什么”，和使用 reducers 来根据 action 更新 state 的用法。

// Store 就是把它们联系到一起的对象。Store 有以下职责：

import { createStore } from 'redux'
import rootReducers from '../reducers'

const configureStore = function(initialState){

	//创建store
	const store = createStore(rootReducers, initialState);


}

export default configureStore