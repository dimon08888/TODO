import React from 'react'
import './todo.css'

const Filter = {
  ALL: 'all',
  ACTIVE: 'active',
  COMPLETED: 'completed',
}

export default class TodoApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = { todos: [], filter: Filter.ALL }
    this.handleTodoAdd = this.handleTodoAdd.bind(this)
    this.handleTodoComplete = this.handleTodoComplete.bind(this)
    this.handleTodoDelete = this.handleTodoDelete.bind(this)
    this.handleFilterChange = this.handleFilterChange.bind(this)
    this.handleClearCompleted = this.handleClearCompleted.bind(this)
  }

  handleTodoAdd(newTodo) {
    this.setState(state => ({ todos: state.todos.concat(newTodo) })) //
  }

  handleTodoComplete(todo) {
    this.setState(state => ({
      todos: state.todos.map(t => (t.id === todo.id ? { ...t, done: !todo.done } : t)),
    }))
  }

  handleTodoDelete(todo) {
    this.setState(state => ({
      todos: state.todos.filter(t => t.id !== todo.id),
    }))
  }

  handleFilterChange(newFilter) {
    this.setState({ filter: newFilter })
  }

  handleClearCompleted() {
    this.setState(state => ({ todos: state.todos.filter(todo => !todo.done) }))
  }

  getFilteredTodos() {
    switch (this.state.filter) {
      case Filter.ALL:
        return this.state.todos
      case Filter.ACTIVE:
        return this.state.todos.filter(todo => !todo.done)
      case Filter.COMPLETED:
        return this.state.todos.filter(todo => todo.done)
    }
  }

  render() {
    const numItemsLeft = this.state.todos.filter(todo => !todo.done).length
    return (
      <div className='todo-wrapper'>
        <h1 className='todo-heading'>Todo List</h1>
        <TodoList
          todos={this.getFilteredTodos()}
          onTodoComplete={this.handleTodoComplete}
          onTodoDelete={this.handleTodoDelete}
        />
        <TodoAddForm todos={this.state.todos} onTodoAdd={this.handleTodoAdd} />
        <br />

        <div>
          <span className='span-items'>
            {numItemsLeft} {numItemsLeft === 1 ? 'item' : 'items'} left&nbsp;&nbsp;
          </span>
          <button
            className='Button-clear-complited'
            disabled={!this.state.todos.some(todo => todo.done)}
            onClick={this.handleClearCompleted}
          >
            Clear Completed
          </button>
        </div>

        <br />
        <TodoFilter filter={this.state.filter} onFilterChange={this.handleFilterChange} />
      </div>
    )
  }
}

class TodoList extends React.Component {
  render() {
    return (
      <ul>
        {this.props.todos.map(todo => (
          <li key={todo.id}>
            <button
              className='btn-li'
              style={{ textDecoration: todo.done ? 'line-through' : null }}
              onClick={() => this.props.onTodoComplete(todo)}
            >
              <i>{todo.text}</i>
            </button>
            <button className='btn-delete' onClick={() => this.props.onTodoDelete(todo)}>
              &times;
            </button>
          </li>
        ))}
      </ul>
    )
  }
}

class TodoAddForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = { text: '' }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(e) {
    this.setState({ text: e.target.value })
  }

  handleSubmit(e) {
    e.preventDefault()

    if (this.state.text.length === 0) {
      return
    }

    const newTodo = {
      id: Date.now(),
      text: this.state.text,
      done: false,
    }

    this.props.onTodoAdd(newTodo)
    this.setState({ text: '' })
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label className='todo-label' htmlFor='todo-input'>
          What needs to be done?
        </label>
        <br />
        <input
          id='todo-input'
          className='todo-input'
          type='text'
          value={this.state.text}
          onChange={this.handleChange}
        />
        <br />
        <button>Add № {this.props.todos.length + 1}</button>
      </form>
    )
  }
}

class TodoFilter extends React.Component {
  render() {
    return (
      <div role='tablist'>
        <button
          className='btn-filter'
          role='tab'
          aria-selected={this.props.filter === Filter.ALL}
          onClick={() => this.props.onFilterChange(Filter.ALL)}
        >
          All
        </button>
        <button
          className='btn-filter'
          role='tab'
          aria-selected={this.props.filter === Filter.ACTIVE}
          onClick={() => this.props.onFilterChange(Filter.ACTIVE)}
        >
          Active
        </button>
        <button
          className='btn-filter'
          role='tab'
          aria-selected={this.props.filter === Filter.COMPLETED}
          onClick={() => this.props.onFilterChange(Filter.COMPLETED)}
        >
          Completed
        </button>
      </div>
    )
  }
}
