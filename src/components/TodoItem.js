import React, {Component, PropTypes} from 'react'
import classnames from 'classnames'
import TodoTextInput from './TodoTextInput'

export default class TodoItem extends Component {
  static propTypes = {
    todo: PropTypes.object.isRequired,
    editTodo: PropTypes.func.isRequired,
    deleteTodo: PropTypes.func.isRequired,
    completeTodo: PropTypes.func.isRequired,
    tagTodo: PropTypes.func.isRequired,
    removeTag: PropTypes.func.isRequired,
  }

  state = {
    editing: false,
    tagging: false,
  }

  handleDoubleClick = () => {
    this.setState({ editing: true })
  }

  handleSave = (id, text) => {
    if (text.length === 0) {
      this.props.deleteTodo(id)
    } else {
      this.props.addTodo(id, text)
    }
    this.setState({ editing: false })
  }

  handleTag = (id, text) => {
    if (text.length > 0) {
      this.props.tagTodo(id, text)
      this.setState({ tagging: false })
    }
  }

  render() {
    const {todo, completeTodo, deleteTodo} = this.props
    let element
    if (this.state.editing) {
      element = (
        <TodoTextInput
          text={todo.title}
          editing={this.state.editing}
          onSave={(text) => this.handleSave(todo.id, text)}
        />
      )
    } 
    else {
      element = (
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            checked={todo.completed}
            onChange={() => completeTodo(todo.id, !todo.completed)}
          />
          <label onDoubleClick={this.handleDoubleClick}>{todo.title}</label>
          {
            todo.tags.map((tag) => {
              return <p key={tag.id} className='tag'>
                {tag.name}
                <button className="delete-tag" onClick={() => this.props.removeTag(tag.id, todo.id)}/>
              </p>
            })
          }
          {
            this.state.tagging
              ? <TodoTextInput
                placeholder="tag here"
                onSave={(text) => this.handleTag(todo.id, text)}
              />
              : <button className="add-tag" onClick={() => this.setState({ tagging: true })} />
          }
          <button className="destroy" onClick={() => deleteTodo(todo.id)} />
        </div>
      )
    }

    return (
      <li className={classnames({
        completed: todo.completed,
        editing: this.state.editing
      })}>
        {element}
      </li>
    )
  }
}
