import React from 'react';
import { render } from 'react-dom';
import Todo from 'Todo';

// render(<Todo.TaskCount />, document.getElementById('task-count'));
render(<Todo.TodoApp />, document.getElementById('task-container'));