import React from 'react'
import Motions from './Motions'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as TodoActions from '../actions'


import deepstream from 'deepstream.io-client-js'
import '../static/css/basic.css'


class Main extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			text: '',
			value:'',
			numLen: props.todos.length
		}
		
		//deepstream connect
		this.ds = deepstream('wss://035.deepstreamhub.com?apiKey=586a89b4-eb36-4142-a6b5-c1b079ab77d6')
		this.client = this.ds.login()

        this.record = this.client.record.getRecord('text/try')
        
        //this.record = this.client.record.getRecord('test/try');
        //event --- button
		this.event = this.client.event	
        
	}
	
	//
	componentWillMount() {

		this.record.set({
			text: this.state.text
		})
		
		//input subscribe		
		this.record.subscribe(data => {
			this.setState({
				text: data.text
			})
		})
		
		//input 
		/*this.record.subscribe(value => {
        	// Update state on input change
            this.setState({
            	value: value.value
            });
            
        });*/
       
       	//event -- remove
	   	 this.event.subscribe('event-data', data => {
	   	 		//console.log(data)
	   	 		const { todos }	= this.props
	   	 		console.log(todos.length)
	            this.setState({
	            	numLen: 0
	            })
	     });
      	
      	//event -- add
      	/*this.event.subscribe('event-add', add => {
      		
      		console.log(add)
      		const { todos } = this.props
      		
      		this.setState({
      			numLen: todos.length
      		})
      	})*/
			
	}
	
	
	//inputTry
	inputTry = (e) => {
		
		//input 
		if(e.target.id == 'firVal'){
			this.setState({
				value: e.target.value
			})
			this.record.set('value', e.target.value)
		}
		
	}
	
	//inputChange
	inputChange = (e) => {
		//input id=="inputChange"
		if(e.target.id == 'inputChange'){
			this.setState({
				text: e.target.value
			})
			this.record.set('text', e.target.value)
		}
		//console.log(e.target.value)
	}
	
	//_onKeyUp
	_onKeyUp = (e) => {
		
		//alert("tip")
		const { text } = this.state;
		if(text == ''){
			alert("please input")
			return
		}
		
		e.keyCode === 13 && this._addData()
		//console.log(e.target.value)
		
		/*this.record.set({
			text: e.target.value
		})*/
		
		
	}
	
	//_addData
	_addData = (e) => {
		
		//alert(tip)
		/*const {text} = this.state;
		if(text == ''){
			alert("please input")
			return
		}*/
		
		const { actions,todos } = this.props
	
		
		let inputValue = this.refs.myInput.value
		actions.addTodo(inputValue)
		
		/*this.setState({
			text: ''
		})*/
		//numLen
		//console.log(todos.length)
		const { numLen } = this.state
		this.setState({
			numLen: todos.length + 1
		})

		this.record.set({
			text:'',
		})
		
		console.log("numLen--"+numLen)
		
		//focus 获取焦点
		const myInput = this.refs.myInput
		myInput.focus()
		
		//event --- addData
		/*const { numLen } = this.state
		this.event.emit('event-add', {
			numLen:0
		})*/
		//console.log(numLen)
		
	}
	
	//removeData
	_removeData = () => {

		const { actions } = this.props
		const { todos } = this.props
		
		actions.removeTodo(todos)
		//console.log(actions.removeTodo(todos))
		//console.log(actions.removeTodo(todos))
		
		this.record.set({
			todos: [],
		})
		//console.log(todos)
		
		//event --- remove
		const { numLen } = this.state
		this.event.emit('event-data', numLen);
		
		//focus 获取焦点
		const myInput = this.refs.myInput
		myInput.focus()
		
	}
	

	//render
	render() {
		const { todos, order, actions } = this.props
		const { text,value, numLen } = this.state
		console.log(order)
		/*todos.map( (con,i) => {
			console.log(con.id);
		} )*/
		//console.log(actions);
		return (
			<div className='container'>
				{/*<input type="text" id = "firVal" placeholder="inut-try"  onChange={this.inputTry} />*/}
				<div className="input-text">
					<input 
						id = "inputChange"
						type="text" 
						placeholder='enter data'
						autoFocus={true}  
						ref="myInput" 
						value={text || ''}
						onKeyUp={this._onKeyUp}
						onChange={this.inputChange}
					/>
					<button onClick={this._addData}>Add+{order.length}</button>
					<button onClick={this._removeData}>Remove</button>
				</div>
		    	<Motions ListItem={todos} order={order} actions={actions} />
			</div>
		);
	}
}



const mapStateToProps = state => ({
	todos: state.todos,
	order: state.order
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(TodoActions, dispatch)
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Main)
