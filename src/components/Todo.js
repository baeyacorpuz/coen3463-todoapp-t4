const React = require('react');
const { render } = require('react-dom');
const $ = require('jquery.min');
const app_url = $("body").attr("data-hostname");

function allTasks(this_state){
  var item = new Array();
  $.ajax({
    url: app_url + "/task/all-tasks/" + $(".home-page").attr("data-username"),
    type: "GET",
    beforeSend: function(data){
      $(".loading").show();
    },
    success: function (data){
      $.each(data.tasks, function (i, val){
        item.push(val);
      });

      this_state.setState({items: item, task_type: "all", counter: data.counter});
      $(".loading").hide();
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
    beforeSend: function(data){
      $(".loading").show();
    },
    success: function (data){
      $.each(data.tasks, function (i, val){
        item.push(val);
      });
      this_state.setState({items: item, task_type: "completed", counter: data.counter});
      $(".loading").hide();
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
    beforeSend: function(data){
      $(".loading").show();
    },
    success: function (data){
      $.each(data.tasks, function (i, val){
        item.push(val);
      });
      this_state.setState({items: item, task_type: "open", counter: data.counter});
      $(".loading").hide();
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
    if(this.props.task_type != "all") this.props.clickNav("all");  
  },
  handleOpen: function (e){
    e.preventDefault();
    if(this.props.task_type != "open") this.props.clickNav("open");
  },
  handleCompleted: function (e){
    e.preventDefault();
    if(this.props.task_type != "completed") this.props.clickNav("completed");
  },
  render: function(){
    var all_css = this.props.task_type == "all" ? "active" : "";
    var open_css = this.props.task_type == "open" ? "active" : "";
    var completed_css = this.props.task_type == "completed" ? "active" : "";
    return (
      <div className="task-nav">
        <a href="#" className={all_css} onClick={this.handleAll}>All</a>
        <a href="#" className={open_css} onClick={this.handleOpen}>Open</a>
        <a href="#" className={completed_css} onClick={this.handleCompleted}>Completed</a>
      </div>
    );
  }
});

var TaskCount = React.createClass({
  getInitialState: function(){
    return { completed: 0, tasks: 0 }
  },
  render: function(){
    var all = this.props.counter.all_tasks;
    var completed = this.props.counter.completed;
    return(
      <h2 className="task-counter">{completed} Completed / {all} Tasks</h2>
    );
  }
});

//* TODO APP */
var TodoApp = React.createClass({
  getInitialState: function(){
    allTasks(this);
    return {items: [], task_type: "all", counter: {all_tasks: 0, completed: 0}};
  },
  updateItems: function(newItem){
    if(newItem != ""){
      var this_state = this;
      $.ajax({
        url: app_url + $(".new-todo").attr("action"),
        type: "POST",
        data: $(".new-todo").serialize(),
        beforeSend: function(data){
          $(".loading").show();
        },
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
      beforeSend: function(data){
        $(".loading").show();
      },
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
          <TaskCount counter={this.state.counter} />
          <CreateList onFormSubmit={this.updateItems} />
          <TaskNav clickNav={this.changeList} task_type={this.state.task_type} />
          <DeleteCompletedList onFormSubmit={this.deleteCompleted} />
          <AnyList items={this.state.items} task_type={this.state.task_type} />
        </div>
      );
    }else if(this.state.task_type == "open"){
      return (
        <div>
          <TaskCount counter={this.state.counter} />
          <CreateList onFormSubmit={this.updateItems} />
          <TaskNav clickNav={this.changeList} task_type={this.state.task_type} />
          <AnyList items={this.state.items} task_type={this.state.task_type} />
        </div>
      );
    }else{
      return (
        <div>
          <TaskCount counter={this.state.counter} />
          <CreateList onFormSubmit={this.updateItems} />
          <TaskNav clickNav={this.changeList} task_type={this.state.task_type} />
          <DeleteCompletedList onFormSubmit={this.deleteCompleted} />
          <UncompletedList items={this.state.items} />
          <CompletedList items={this.state.items} />
        </div>
      );
    }
    
  }
});


export default { TodoApp };