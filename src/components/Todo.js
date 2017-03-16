const React = require('react');
const ReactDOM = require('react-dom');
const $ = require('jquery.min');
const app_url = $("body").attr("data-hostname");

function allTasks(this_state){
  var item = new Array();
  $.ajax({
    url: app_url + "/task/all-tasks/" + $(".home-page").attr("data-username"),
    type: "GET",
    success: function (data){
      $.each(data, function (i, val){
        item.push(val);
      });

      this_state.setState({items: item});
    },
    error: function (data){

    }
  });
}

//* TODO LIST ITEM */
var TodoListItem = React.createClass({
  render: function(){
    var completed_link = app_url + "/task/complete/" + this.props.children._id;
    var delete_link = app_url + "/task/delete/" + this.props.children._id;
    return (
      <li>
        <span>{this.props.children.name}</span>
        <a href={completed_link}>Complete</a>
        <a href={delete_link}>Delete</a>
      </li>
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
    return(
      <ul className="todo-list">
        <h3>Uncompleted Tasks</h3>
        {this.props.items.map(createItem)}
      </ul>
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
      <form method="POST" action="/task/newtask" onSubmit={this.handleSubmit} className="new-todo">
        <input type='text' ref='item' name="task" onChange={this.onChange} value={this.state.item} className="new-todo-input"/>
        <input type='submit' value='Add Task' className="new-todo-button"/>
      </form>
    );
  }
});

//* DELETE LIST */
var DeleteAllList = React.createClass({
  render: function(){
    return (
      <form onSubmit={this.handleSubmit} className="clear-list-form">
        <input type='submit' value='Clear All List'/>
      </form>
    );
  }
});


//* TODO APP */
var TodoApp = React.createClass({
  getInitialState: function(){
    allTasks(this);
    return {items: []};
  },
  updateItems: function(newItem){
    if(newItem != ""){
      var this_state = this;
      $.ajax({
        url: app_url + $(".new-todo").attr("action"),
        type: "POST",
        data: $(".new-todo").serialize(),
        success: function (data){
          allTasks(this_state);
        },
        error: function (data){

        }
      });
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
        <CreateList onFormSubmit={this.updateItems}/>
        <DeleteAllList onFormSubmit={this.deleteAllItems}/>
        <TodoList items={this.state.items}/>
      </div>
    );
  }
});

export default TodoApp;