const React = require('react');
const { render } = require('react-dom');
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

      this_state.setState({items: item, task_type: "all"});
    },
    error: function (data){

    }
  });
}

function completedTasks(this_state){
  var item = new Array();
  $.ajax({
    url: app_url + "/task/completed-tasks/" + $(".home-page").attr("data-username"),
    type: "GET",
    success: function (data){
      $.each(data, function (i, val){
        item.push(val);
      });
      this_state.setState({items: item, task_type: "completed"});
    },
    error: function (data){

    }
  });
}

function uncompletedTasks(this_state){
  var item = new Array();
  $.ajax({
    url: app_url + "/task/uncompleted-tasks/" + $(".home-page").attr("data-username"),
    type: "GET",
    success: function (data){
      $.each(data, function (i, val){
        item.push(val);
      });
      this_state.setState({items: item, task_type: "open"});
    },
    error: function (data){

    }
  });
}

//* CREATE LIST */
var CreateList = React.createClass({
  getInitialState: function() {
    return {item: ''};
  },
  handleSubmit: function(e){
    e.preventDefault();
    this.props.onFormSubmit(this.state.item);
    this.setState({item: ''});
    // React.findDOMNode(this.refs.item).focus();
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
var DeleteCompletedList = React.createClass({
  handleSubmit: function(e){
    e.preventDefault();
    this.props.onFormSubmit();
  },
  render: function(){
    return (
      <form method="POST" action="/task/delete-all-completed" onSubmit={this.handleSubmit} className="clear-list-form clearfix">
        <input type='submit' value='Clear All Completed' className="clear-completed" />
      </form>
    );
  }
});

//* TODO LIST ITEM */
var TodoListItem = React.createClass({
  render: function(){
    var completed_link = this.props.children.isComplete ? app_url + "/task/uncomplete/" + this.props.children._id : app_url + "/task/complete/" + this.props.children._id;
    var complete_text = this.props.children.isComplete ? "Uncomplete" : "Complete";
    var delete_link = app_url + "/task/delete/" + this.props.children._id;
    return (
      <li>
        <span>{this.props.children.name}</span>
        <a href={completed_link}>{complete_text}</a>
        <a href={delete_link}>Delete</a>
      </li>
    );
  }
});

var AnyList = React.createClass({
  render: function() {
    var this_state = this;
    var title = this_state.props.task_type == "completed" ? "Completed" : "Open";
    var createItem = function(task) {
      return (
        <TodoListItem>{task}</TodoListItem>
      );
    };
    var count = 0;
    this_state.props.items.map(function(task){
      var task_is_complete = task.isComplete ? "completed" : "open";
      if(this_state.props.task_type == task_is_complete) count += 1;
    });
    return(
      <ul className="todo-list todo-list-one">
        <h3>{title} Tasks ({count})</h3>
        {this.props.items.map(createItem)}
      </ul>
    );
  }
});

var UncompletedList = React.createClass({
  render: function() {
    var this_state = this;
    var createItem = function(item) {
      if(!item.isComplete){
        return (
          <TodoListItem>{item}</TodoListItem>
        );
      }else return;
    };
    var count = 0;
    this_state.props.items.map(function(task){
      if(!task.isComplete) count += 1;
    });
    return(
      <ul className="todo-list">
        <h3>Open Tasks ({count})</h3>
        {this.props.items.map(createItem)}
      </ul>
    );
  }
});

var CompletedList = React.createClass({
  render: function() {
    var this_state = this;
    var createItem = function(item) {
      if(item.isComplete){
        return (
          <TodoListItem>{item}</TodoListItem>
        );
      }else return;
    };
    var count = 0;
    this_state.props.items.map(function(task){
      if(task.isComplete) count += 1;
    });
    return(
      <ul className="todo-list">
        <h3>Completed Tasks ({count})</h3>
        {this.props.items.map(createItem)}
      </ul>
    );
  }
});

var TaskNav = React.createClass({
  handleAll: function (e){
    e.preventDefault();
    this.props.clickNav("all");
  },
  handleOpen: function (e){
    e.preventDefault();
    this.props.clickNav("open");
  },
  handleCompleted: function (e){
    e.preventDefault();
    console.log('hey');
    this.props.clickNav("completed");
  },
  render: function(){
    return (
      <div className="task-nav">
        <a href="#" onClick={this.handleAll}>All</a>
        <a href="#" onClick={this.handleOpen}>Open</a>
        <a href="#" onClick={this.handleCompleted}>Completed</a>
      </div>
    );
  }
});

//* TODO APP */
var TodoApp = React.createClass({
  getInitialState: function(){
    allTasks(this);
    return {items: [], task_type: "all"};
  },
  updateItems: function(newItem){
    if(newItem != ""){
      var this_state = this;
      $.ajax({
        url: app_url + $(".new-todo").attr("action"),
        type: "POST",
        data: $(".new-todo").serialize(),
        success: function (data){
          if(this_state.state.task_type == "completed"){
            completedTasks(this_state);
          }else if(this_state.state.task_type == "open"){
            uncompletedTasks(this_state);
          }else allTasks(this_state);
        },
        error: function (data){

        }
      });
    }else{
      alert("Item must not be blank!")
    }
  },
  changeList: function(task_type){
    if(task_type == "completed"){
      completedTasks(this);
    }else if(task_type == "open"){
      uncompletedTasks(this);
    }else allTasks(this);
  },
  deleteCompleted: function(){
    var this_state = this;
    $.ajax({
      url: app_url + $(".clear-list-form").attr("action"),
      type: "POST",
      data: $(".clear-list-form").serialize(),
      success: function (data){
        if(data.status == 'success'){
          if(this_state.state.task_type == "completed"){
            completedTasks(this_state);
          }else if(this_state.state.task_type == "open"){
            uncompletedTasks(this_state);
          }else allTasks(this_state);
        }
      },
      error: function (data){

      }
    });
  },
  render: function(){
    if(this.state.task_type == "completed"){
      return (
        <div>
          <CreateList onFormSubmit={this.updateItems} />
          <TaskNav clickNav={this.changeList} />
          <DeleteCompletedList onFormSubmit={this.deleteCompleted} />
          <AnyList items={this.state.items} task_type={this.state.task_type} />
        </div>
      );
    }else if(this.state.task_type == "open"){
      return (
        <div>
          <CreateList onFormSubmit={this.updateItems} />
          <TaskNav clickNav={this.changeList} />
          <AnyList items={this.state.items} task_type={this.state.task_type} />
        </div>
      );
    }else{
      return (
        <div>
          <CreateList onFormSubmit={this.updateItems} />
          <TaskNav clickNav={this.changeList} />
          <DeleteCompletedList onFormSubmit={this.deleteCompleted} />
          <UncompletedList items={this.state.items} />
          <CompletedList items={this.state.items} />
        </div>
      );
    }
    
  }
});

var TaskCount = React.createClass({
  getInitialState: function(){
    return { completed: 0, tasks: 0 }
  },
  render: function(){
    return(
      <h2>{this.state.completed} Completed / 12 Tasks</h2>
    );
  }
});

export default { TodoApp, TaskCount };