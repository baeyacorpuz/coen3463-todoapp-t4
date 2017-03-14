var React = require('react');
var ReactDOM = require('react-dom');

alert("Welcome to your Task List!!")

//* TODO BANNER && TODO LIST */
var TodoBanner = React.createClass({
  render: function(){
    return (
      <h3>TODO</h3>
    );
  }
});


var TodoList = React.createClass({
  render: function() {
    var createItem = function(itemText) {
      return (
        <TodoListItem>{itemText}</TodoListItem>
      );
    };
    return <ul>{this.props.items.map(createItem)}</ul>;
  }
});


//* TODO LIST ITEM */
var TodoListItem = React.createClass({
  render: function(){
    return (
      <li>{this.props.children}</li>
    );
  }
});


//* CREATE LIST */
var CreateList = React.createClass({
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
      <form onSubmit={this.handleSubmit} className="list-form"  className="new-todo">
        <input type='text' ref='item' onChange={this.onChange} value={this.state.item}/>
        <input type='submit' value='Add'/>
      </form>
    );
  }
});

//* DELETE LIST */
var DeleteAllList = React.createClass({
  render: function(){
    return (
      <form onSubmit={this.handleSubmit} className="list-form">
        <input type='submit' value='Clear'/>
      </form>
    );
  }
});


//* TODO APP */
var TodoApp = React.createClass({
  getInitialState: function(){
    return {items: []};
  },
  updateItems: function(newItem){
    if(newItem != ""){
      var allItems = this.state.items.concat([newItem]);
      this.setState({items: allItems});
    }else{
      alert("Item must not be blank!")
    }
  },
  deleteAllItems: function(){
    this.setState(this.getInitialState());
  },
  render: function(){
    return (
      <div>
        <TodoBanner/>
        <TodoList items={this.state.items}/>
        <CreateList onFormSubmit={this.updateItems}/>
        <DeleteAllList onFormSubmit={this.deleteAllItems}/>
      </div>
    );
  }
});

export default TodoApp;