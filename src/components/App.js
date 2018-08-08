import React, {Component} from 'react'
import Header from './Header'
import MainSection from './MainSection'

const baseUrl = 'http://todo-back-end.herokuapp.com/todos';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      todos: [],
      gameID: null,
      player: 0
    }
  }

  doFetchDelete = (url) => {
    return fetch(url, {
      method: 'delete'
    })
      .then(response => response.json());
  }

  doFetchGet = (url) => {
    return fetch(url)
      .then(response => response.json());
  }

  doFetchPost = (url, data) => {
    return fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, cors, *same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, same-origin, *omit
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            // "Content-Type": "application/x-www-form-urlencoded",
        },
        redirect: "follow", // manual, *follow, error
        referrer: "no-referrer", // no-referrer, *client
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
    .then(response => response.json()); // parses response to JSON
  }

  doFetchPut = (url, data) => {
    return fetch(url, {
        method: "PUT", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, cors, *same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, same-origin, *omit
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            // "Content-Type": "application/x-www-form-urlencoded",
        },
        redirect: "follow", // manual, *follow, error
        referrer: "no-referrer", // no-referrer, *client
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
    .then(response => response.json()); // parses response to JSON
  }

  addTodo = (text) => {
    const newTodo = {
      completed: false,
      title: text
    };

    this.doFetchPost(baseUrl, newTodo)
      .then(data => {
        const todos = [
          data,
          ...this.state.todos
        ]
        this.setState({todos});
      });
  }

  addTag = (todoId, text) => {
    const newTag = {
      name: text
    };

    this.doFetchPost(baseUrl + '/' + todoId + '/tags', newTag)
      .then(data => {
        let updatedTodo = this.state.todos.find((todo) => todo.id === todoId);
        updatedTodo.tags.push(data);
        const todos = this.state.todos.map(todo =>
          todo.id === todoId ? updatedTodo : todo
        )
        this.setState({todos});
      });
  }

  removeTag = (id, todoId) => {
    this.doFetchDelete(baseUrl + '/' + todoId + '/tags/' + id)
      .then(() => {
        let updatedTodo = this.state.todos.find((todo) => todo.id === todoId);
        updatedTodo.tags = updatedTodo.tags.filter(tag => tag.id !== id);
        const todos = this.state.todos.map(todo => todo.id === todoId ? updatedTodo : todo);
        this.setState({todos})
      });
  }

  deleteTodo = (id) => {
    this.doFetchDelete(baseUrl + '/' + id)
      .then(() => {
        const todos = this.state.todos.filter(todo => todo.id !== id)
        this.setState({todos})
      });
  }

  editTodo = (id, text) => {
    const todo = this.state.todos.find((todo) => todo.id === id);
    const updatedTodo = {
      ...todo,
      title: text
    };
    this.doFetchPut(baseUrl + '/' + id, updatedTodo)
      .then(data => {
        const todos = this.state.todos.map(todo =>
          todo.id === id ? data : todo
        )
        this.setState({todos})
      });
  }

  completeTodo = (id, completed=true) => {
    const todo = this.state.todos.find((todo) => todo.id === id);
    const updatedTodo = {
      ...todo,
      completed: completed
    };
    this.doFetchPut(baseUrl + '/' + id, updatedTodo)
      .then(data => {
        const todos = this.state.todos.map(todo =>
          todo.id === id ? data : todo
        )
        this.setState({todos})
      });
  }

  completeAll = () => {
    const areAllMarked = this.state.todos.every(todo => todo.completed);
    this.state.todos.forEach((todo) => {
      this.completeTodo(todo.id, !areAllMarked);
    });
  }

  clearCompleted = () => {
    const todos = this.state.todos.filter(todo => todo.completed === true)
    todos.forEach((todo) => this.deleteTodo(todo.id));
  }

  actions = {
    addTodo: this.addTodo,
    deleteTodo: this.deleteTodo,
    editTodo: this.editTodo,
    completeTodo: this.completeTodo,
    completeAll: this.completeAll,
    clearCompleted: this.clearCompleted,
    tagTodo: this.addTag,
    removeTag: this.removeTag,
  }

  componentDidMount() {
    this.doFetchGet(baseUrl)
      .then(todos => {
        this.setState({ todos: todos });
      });
  }

  render() {
    return(
      <div>
        <Header addTodo={this.actions.addTodo} />
        <MainSection todos={this.state.todos} actions={this.actions} />
      </div>
    )
  }
}

export default App
