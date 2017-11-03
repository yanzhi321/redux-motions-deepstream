import React, { Component } from 'react'
import {Motion, spring} from 'react-motion';

import deepstream from 'deepstream.io-client-js'

import  '../static/css/basic.css';

import hamster from '../static/swf/hamster.swf'

class Item extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	edit: false,
	  }
	}

	_handleClickDelete = () => {
		const { id } = this.props.item
		const { actions } = this.props
		console.log(actions.deleteTodo(id))
		
		actions.deleteTodo(id)
		this.setState({
			edit: false
		})

		//delete
		//console.log(id);
		//console.log(actions)
	}

	_handleClickEdit = () => {
		this.setState({
			edit: true
		})
	}

	_onKeyUp = e => {
		e.keyCode === 13 && this._handler()
		let inputValue = this.refs.edit.value
		const { id } = this.props.item
		const { actions } = this.props
		actions.editTodo(id, inputValue)
	}

	_handler = () => {
		//console.log("888")
		let inputValue = this.refs.edit.value
		const { id } = this.props.item
		const { actions } = this.props
		actions.editTodo(id, inputValue)
		this.setState({
			edit: false
		})
		
	}

	render() {
		const { item } = this.props
		const { onMouseDown, onTouchStart, style } = this.props
		const { edit } = this.state
		//console.log(order)
		return (
				<div>
					<div className="hamster">
						<embed  width='200' height='150' style={{ position:'absolute', bottom:50, right:50}}   src={hamster}  name="honehoneclock" >
						</embed>
					</div>
					<div
						className="list-item"
						onMouseDown={onMouseDown}
						onTouchStart={onTouchStart}
						style={style}
					>
						{/*<e className="edit" onClick={this._handleClickEdit}>{item.id}---{item.text}</e>
						{edit ? (
							<input
								autoFocus
								ref='edit'
								className='edit_input'
								placeholder={item.text}
								onKeyUp={this._onKeyUp}
							/>
						) : (
							<p className='item_text'>{item.text}</p>
						)}*/}
						<span className="edit"> {item.id}--{this.props.order}--{item.text} </span>
						<button className="destroy" onClick={this._handleClickDelete}></button>
					</div>
			</div>
		);
	}
}



function reinsert(arr, from, to) {
  const _arr = arr.slice(0);
  const val = _arr[from];
  _arr.splice(from, 1);
  _arr.splice(to, 0, val);
  return _arr;
}

function clamp(n, min, max) {
  return Math.max(Math.min(n, max), min);
}

const springConfig = {stiffness: 300, damping: 50};


export default class Motions extends Component {
	constructor(props) {
	  super(props);
	  this.state = {
	  		ListItem: props.ListItem,
	  		order: props.order,
	      	topDeltaY: 0,
	      	mouseY: 0,
	      	isPressed: false,
	      	originalPosOfLastPressed: 0
	    }
	    
	    this.ds = deepstream('wss://035.deepstreamhub.com?apiKey=586a89b4-eb36-4142-a6b5-c1b079ab77d6')
		this.client = this.ds.login()

        this.record = this.client.record.getRecord('todos')
	}

	componentWillMount() {
		//console.log("success")
		
		const { ListItem, order, topDeltaY, mouseY, isPressed, originalPosOfLastPressed } = this.state
		this.record.set('ListItem', {
			ListItem: ListItem,
		})
		this.record.set('order', {
			order: order,
		})
		this.record.set('topDeltaY', {
			topDeltaY: topDeltaY,
		})
		this.record.set('mouseY', {
			mouseY: mouseY,
		})
		this.record.set('isPressed', {
			isPressed: isPressed,
		})
		this.record.set('originalPosOfLastPressed', {
			originalPosOfLastPressed: originalPosOfLastPressed
		})
		// this.record.set({
		// 	ListItem: ListItem,
		// 	order: order,
		// 	topDeltaY: topDeltaY,
		// 	mouseY: mouseY,
		// 	isPressed: isPressed,
		// 	originalPosOfLastPressed: originalPosOfLastPressed
		// })
	}

	componentDidMount() {
	    window.addEventListener('touchmove', this.handleTouchMove);
	    window.addEventListener('touchend', this.handleMouseUp);
	    window.addEventListener('mousemove', this.handleMouseMove);
	    window.addEventListener('mouseup', this.handleMouseUp);

	    this.record.subscribe('ListItem', data => {
	    	this.setState({
	    		ListItem: data.ListItem,
	    	})
	    })
	    this.record.subscribe('order', data => {
	    	this.setState({
	    		order: data.order,
	    	})
	    })
	    this.record.subscribe('topDeltaY', data => {
	    	this.setState({
	    		topDeltaY: data.topDeltaY,
	    	})
	    })
	    this.record.subscribe('mouseY', data => {
	    	this.setState({
	    		mouseY: data.mouseY,
	    	})
	    })
	    this.record.subscribe('isPressed', data => {
	    	this.setState({
	    		isPressed: data.isPressed,
	    	})
	    })
	    this.record.subscribe('originalPosOfLastPressed', data => {
	    	this.setState({
	    		originalPosOfLastPressed: data.originalPosOfLastPressed
	    	})
	    })

	 //    this.record.subscribe(data => {
		// 	this.setState({
		// 		ListItem: data.ListItem,
		// 		order: data.order,
		// 		topDeltaY: data.topDeltaY,
		// 		mouseY: data.mouseY,
		// 		isPressed: data.isPressed,
		// 		originalPosOfLastPressed: data.originalPosOfLastPressed
		// 	})
		// })
	}
	
	
	//component will update
	componentWillUpdate(nextProps, nextState) {
		
		console.log("success---"+ new Date())
		
		const { actions } = this.props
		//console.log(nextProps.ListItem)
		/*
		 * edit Item
		 */
		if (nextProps.ListItem !== this.props.ListItem && nextProps.ListItem.length === this.props.ListItem.length) {

			this.record.set('ListItem', {
				ListItem: nextProps.ListItem
			})
		}

		/*
		 * add one Item
		 */
		if (nextProps.ListItem.length > this.props.ListItem.length) {

			let this_state_order = this.state.order
			if (this_state_order.length >= 1) {
				this_state_order.unshift(Math.max(...this_state_order) + 1)
			} else {
				this_state_order.unshift(0)
			}
			console.log(this_state_order)
			//console.log("3333")
			//console.log(nextProps.ListItem )
			/*console.log(nextProps.ListItem.map((con, i) => {
				return(con.text+ "---" +i)
			}))*/
			//console.log(nextProps.ListItem.length > this.props.ListItem.length)
			actions.changeOrder(this_state_order)
		}

		if (nextProps.order.length > this.props.order.length) {
//			const order_props = nextProps.order 
//			const order_state = nextState.order 
//			console.log("order_props:",order_props)
//			console.log("order_state",order_state)
//			
			this.record.set('ListItem', {
				ListItem: nextProps.ListItem,
				// order: nextProps.order
			})

			this.record.set('order', {
				order: nextProps.order
			})
			///console.log(nextProps.order)
		}


		/*
		 * delete one Item
		 */
		if (nextProps.ListItem.length < this.props.ListItem.length) {
			//console.log(nextState)

			let com = Array.from(new Set([...new Set(nextState.order)]
						.filter(item =>
							!new Set(nextProps.ListItem.map(i => i.id)).has(item)
							)
						)
					)[0]

			//console.log('com---'+ com)
			let next_state_order = nextState.order
			next_state_order.splice(nextState.order.indexOf(com), 1)

			actions.changeOrder(next_state_order)
			//console.log('delete')
			console.log("delete---"+next_state_order)
		}


		if (nextProps.order.length < this.props.order.length) {
			
			const order_props = nextProps.order 
			const order_state = nextState.order 
			console.log("order_props:",order_props)
			console.log("order_state",order_state)
			

			this.record.set('ListItem', {
				ListItem: nextProps.ListItem,
				// order: nextProps.order
			})

			this.record.set('order', {
				order: nextProps.order
			})
		}
		
		//console.log(nextProps.ListItem)
		//console.log(nextProps.order)
		//remove All
		if (nextProps.ListItem.length == 0){
			
			let new_order = nextState.order.splice(0, nextState.order.length);
			//actions.changeOrder(new_order)
			
			console.log(new_order)
			
			//console.log(nextProps.order)
			
			//console.log(nextState.order)
			
			//console.log("remove All")

		}
		
		/*if (nextProps.ListItem.length == 0){
			
			//new_order
			let new_order = nextState.order.splice(0, nextState.order.length);
			this.record.set('ListItem', {
				order: new_order
			})
			
			this.record.set('ListItem', {
				ListItem: []
			})
			
		}*/
		
		
	}


	handleTouchStart = (key, pressLocation, e) => {
	    this.handleMouseDown(key, pressLocation, e.touches[0]);
	 }

	handleMouseDown = (pos, pressY, {pageY}) => {
		// this.setState({
		// 	topDeltaY: pageY - pressY,
	 //      	mouseY: pressY,
	 //      	isPressed: true,
	 //      	originalPosOfLastPressed: pos
		// })
		this.record.set('topDeltaY', {
			topDeltaY: pageY - pressY,
		})
		this.record.set('mouseY', {
			mouseY: pressY,
		})
		this.record.set('isPressed', {
			isPressed: true,
		})
		this.record.set('originalPosOfLastPressed', {
			originalPosOfLastPressed: pos
		})

		// this.record.set({
		// 	topDeltaY: pageY - pressY,
	 //      	mouseY: pressY,
	 //      	isPressed: true,
	 //      	originalPosOfLastPressed: pos
		// })
	}

	handleTouchMove = (e) => {
    	//e.preventDefault();
    	this.handleMouseMove(e.touches[0]);
  	}

  	handleMouseMove = (e) => {
  		
  		//判断是浏览器还是手机
  		 const a = navigator.userAgent;
    	//use navigator to judge browser or ios & android,
	    if(a.indexOf("Android")!=-1 || a.indexOf("iPhone")!=-1 || a.indexOf("iPad")!=-1 ){
				
	         //console.log('this is ios & Android & iPad')
		
		}else if(a.indexOf('browser')) {
	    	e.preventDefault();
		}
		
  		const { actions, order } = this.props
	    const {isPressed, topDeltaY, originalPosOfLastPressed} = this.state;

	    if (isPressed) {
			const mouseY = e.pageY - topDeltaY;
			const currentRow = clamp(Math.round(mouseY / 100), 0, order.length - 1);
			let newOrder = order;

			if (currentRow !== order.indexOf(originalPosOfLastPressed)){
				newOrder = reinsert(order, order.indexOf(originalPosOfLastPressed), currentRow);
			}
			
			actions.changeOrder(newOrder)
			
			console.log("newOrder---"+newOrder)
			// this.setState({
			// 	mouseY: mouseY,
			// 	order: order
			// })

			// this.record.set({
			// 	mouseY: mouseY,
			// 	order: order
			// })

			this.record.set('mouseY', {
				mouseY: mouseY,
			})
			this.record.set('order', {
				order: order
			})
	    }
	  }

	handleMouseUp = () => {
		// this.setState({
		// 	isPressed: false,
		// 	topDeltaY: 0
		// })

		// this.record.set({
		// 	isPressed: false,
		// 	topDeltaY: 0
		// })

		this.record.set('isPressed', {
			isPressed: false,
		})
		this.record.set('topDeltaY', {
			topDeltaY: 0
		})
  	}

	render() {
		const { actions } = this.props
		const order_props = this.props.order 
		const { ListItem, order, mouseY, isPressed, originalPosOfLastPressed } = this.state
		//console.log(ListItem)
		
		return (
			<div className='out-box'>
				<div>order_props:{order_props},order: {order}</div>
				{ListItem.map((item, i) =>
					{
						const style = originalPosOfLastPressed === item.id && isPressed ? {
			                scale: spring(1.1, springConfig),
			                shadow: spring(16, springConfig),
			                y: mouseY
			              }
			            : {
			                scale: spring(1, springConfig),
			                shadow: spring(1, springConfig),
			                y: spring(order.indexOf(item.id) * 100, springConfig)
			              }

			             return (
			             	<Motion style={style} key={i}>
				              {({scale, shadow, y}) =>
								
				              	<Item
				              		item={item}
				              		actions={actions}
				              		key={i}
				              		onMouseDown={this.handleMouseDown.bind(null, item.id, y)}
				                  	onTouchStart={this.handleTouchStart.bind(null, item.id, y)}
				                  	style={{
				                    boxShadow: `rgba(0, 0, 0, 0.2) 0px ${shadow}px ${2 * shadow}px 0px`,
				                    transform: `translate3d(0, ${y}px, 0) scale(${scale})`,
				                    WebkitTransform: `translate3d(0, ${y}px, 0) scale(${scale})`,
				                    zIndex: item.id === originalPosOfLastPressed ? 99 : item.id
				                  }}
				                  
				              	/>
				              	
				              }
				            </Motion>
			             )
					}
				)}
			</div>
		);
	}
}