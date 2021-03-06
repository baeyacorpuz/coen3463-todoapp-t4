var express = require('express');
var router = express.Router();
var Task = require('../models/tasks');

router.post('/newtask', function(req, res, next) {
	if(req.user){
		console.log(req.body.task);
		var newtask = {
			name: req.body.task,
			owner: req.user._id
		}

		var task = new Task(newtask);

		task.save( function(err) {
      if(err){
      	throw err;
      }else{
      	res.json({ message: "New Task Saved!" });
      }
    });
  }
  else {
    res.render('login', {
      title: 'Login | Task List',
      alertMessage: req.flash('alertMessage')
    });
  }
});

router.get("/all-tasks/:username", function(req, res, next){
	var user_id = req.user._id;
	Task.find({ owner: user_id }, function(err, tasks) {
	  if (err) throw err;
	  Task.find({ owner: user_id }, function(err, inner_tasks) {
		  if (err) throw err;
		  var com_count = 0;
		  inner_tasks.map(function(x) {
		  	if( x.isComplete ) com_count += 1;
		  });
	  	feedback = { tasks: tasks, counter: {all_tasks: inner_tasks.length, completed: com_count} };
	  	res.json(feedback);
		});
	});
});

router.get("/uncompleted-tasks/:username", function(req, res, next){
	var user_id = req.user._id;
	Task.find({ owner: user_id, isComplete: false }, function(err, tasks) {
	  if (err) throw err;
	  Task.find({ owner: user_id }, function(err, inner_tasks) {
		  if (err) throw err;
		  var com_count = 0;
		  inner_tasks.map(function(x) {
		  	if( x.isComplete ) com_count += 1;
		  });
	  	feedback = { tasks: tasks, counter: {all_tasks: inner_tasks.length, completed: com_count} };
	  	res.json(feedback);
		});
	});
});

router.get("/completed-tasks/:username", function(req, res, next){
	var user_id = req.user._id;
	Task.find({ owner: user_id, isComplete: true }, function(err, tasks) {
	  if (err) throw err;
	  Task.find({ owner: user_id }, function(err, inner_tasks) {
		  if (err) throw err;
		  var com_count = 0;
		  inner_tasks.map(function(x) {
		  	if( x.isComplete ) com_count += 1;
		  });
	  	feedback = { tasks: tasks, counter: {all_tasks: inner_tasks.length, completed: com_count} };
	  	res.json(feedback);
		});
	});
});

router.get("/delete/:task_id", function(req, res, next){
	Task.findOneAndRemove({ _id: req.params.task_id }, function(err) {
	  if(err){
      res.redirect('/');
    }
    else{
      req.flash('alertMessage', 'Save Success');
  		res.redirect('/');
    }
	});
});

router.get("/complete/:task_id", function(req, res, next){
	Task.findByIdAndUpdate(req.params.task_id, { isComplete: true }, function(err) {
	  if(err){
      res.redirect('/');
    }
    else{
      req.flash('alertMessage', 'Save Success');
  		res.redirect('/');
    }
	});
});

router.get("/uncomplete/:task_id", function(req, res, next){
	Task.findByIdAndUpdate(req.params.task_id, { isComplete: false }, function(err) {
	  if(err){
      res.redirect('/');
    }
    else{
      req.flash('alertMessage', 'Save Success');
  		res.redirect('/');
    }
	});
});

router.post("/delete-all-completed", function(req, res, next){
	Task.find({ owner: req.user._id, isComplete: true }, function(err, tasks) {
	  if (err) throw err;
	  tasks.map(function(t){
	  	Task.findByIdAndRemove(t._id, function(err) {
			  if (err) throw err;
			  console.log('Task deleted!');
			});
	  });
  	// console.log(user.map(function(b) {return b;}));
	});

	res.json({ status: "success", message: "All Completed has been Deleted!" });
});

module.exports = router;