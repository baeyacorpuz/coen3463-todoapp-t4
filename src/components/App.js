import React, { Component } from 'react';

class App extends Component {
  render() {
    return(
      <h1>Hello {this.props.name}!<h1>
    )
  }
};

/* [TODO APP] */
var TodoApp = React.createClass({
	getInitialState: function(){
		return {items: []};
	},
	updateItems: function(newItem){
		var allItems = this.state.items.concat([newItem]);
		this.setState({items: allItems});
	},
	render: function(){
		return (
			<div>
				<TodoBanner/>
				<TodoList items={this.state.items}>
				<TodoForm onFormSubmit={this.updateItems}/>
			</div>
		);
	}
});

	/* [TODO BANNER] && [TODO LIST] */
	var TodoBanner = React.createClass({
		render: function(){
			return (
				<h3>TODO<h3>
			);
		}
	});
	var TodoList = React.createClass({
		render: function() {
			var createItem = function(itemText) {
				return (
					<TodoListItem>{itemText}<TodoListItem>
				);
			};
			return <ul>{this.props.items.map(createItem)}<ul>;
		}
	});

		/* [TODO LIST ITEM] */
		var TodoListItem = React.createClass({
			render: function(){
				return (
					<li>{this.props.children}<li>
				);
			}
		});

	/* [TODO FORM] */
	var TodoForm = React.createClass({
		getInitialState: function() {
			return {item: ''};
		},
		handleSubmit: function(e){
			e.preventDefault();
			this.props.onFormSubmit(this.state.item);
			this.setState({item: ''});
			React.findDOMNode(this.refs.item).focus();
			return;
		},
		onChange: function(e){
			this.setState({
				item: e.target.value
			});
		},
		render: function(){
			return (
				<form onSubmit={this.handleSubmit}>
					<input type='text' ref='item' onChange={this.onChange} value={this.state.item}/>
					<input type='submit' value='Add'/>
				<form>
			);
		}
	});

React.render(<TodoApp/>, document.body);