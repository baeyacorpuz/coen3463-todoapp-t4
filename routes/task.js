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
	Task.find({ owner: req.user._id }, function(err, tasks) {
	  if (err) throw err;
  	res.json(tasks)
  	// console.log(user.map(function(b) {return b;}));
	});
});

router.get("/uncompleted-tasks/:username", function(req, res, next){
	Task.find({ owner: req.user._id, isComplete: false }, function(err, tasks) {
	  if (err) throw err;
	  res.json(tasks)
  	// console.log(user.map(function(b) {return b;}));
	});
});

router.get("/completed-tasks/:username", function(req, res, next){
	Task.find({ owner: req.user._id, isComplete: true }, function(err, tasks) {
	  if (err) throw err;
	  res.json(tasks)
  	// console.log(user.map(function(b) {return b;}));
	});
});

router.get("/delete/:task_id", function(req, res, next){
	Task.findOneAndRemove({ _id: req.params.task_id }, function(err) {
	  if(err){
      res.render('index', {
        user: req.user,
        title: 'Task List',
        hostname: req.protocol + "://" + req.headers.host
	    });
    }
    else{
      req.flash('alertMessage', 'Save Success');
  		res.render('index', {
        user: req.user,
        title: 'Task List',
        hostname: req.protocol + "://" + req.headers.host
	    });
    }
	});
});

router.get("/complete/:task_id", function(req, res, next){
	Task.findByIdAndUpdate(req.params.task_id, { isComplete: true }, function(err) {
	  if(err){
      res.redirect('/', {
        user: req.user,
        title: 'Task List',
        hostname: req.protocol + "://" + req.headers.host
	    });
    }
    else{
      req.flash('alertMessage', 'Save Success');
  		res.render('index', {
        user: req.user,
        title: 'Task List',
        hostname: req.protocol + "://" + req.headers.host
	    });
    }
	});
});

router.get("/uncomplete/:task_id", function(req, res, next){
	Task.findByIdAndUpdate(req.params.task_id, { isComplete: false }, function(err) {
	  if(err){
      res.redirect('/', {
        user: req.user,
        title: 'Task List',
        hostname: req.protocol + "://" + req.headers.host
	    });
    }
    else{
      req.flash('alertMessage', 'Save Success');
  		res.render('index', {
        user: req.user,
        title: 'Task List',
        hostname: req.protocol + "://" + req.headers.host
	    });
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