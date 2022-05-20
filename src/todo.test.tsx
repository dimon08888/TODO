import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import TodoApp from './todo'

function addTodo(text: string) {
  const addButton = screen.getByRole('button', { name: /add №/i })
  const nameInput = screen.getByRole('textbox', { name: /what needs to be done?/i })

  userEvent.type(nameInput, text)
  userEvent.click(addButton)

  const newTodoButton = screen.getByRole('button', { name: text })
  return newTodoButton
}

test('adds new todo when entered a todo name and pressed add button', () => {
  render(<TodoApp />)

  const addButton = screen.getByRole('button', { name: /add № 1/i })
  const nameInput = screen.getByRole('textbox', { name: /what needs to be done?/i })
  const itemsLeftText = screen.getByText(/0 items left/i)

  userEvent.click(addButton)
  expect(screen.queryByRole('button', { name: '' })).not.toBeInTheDocument()

  userEvent.type(nameInput, 'New Todo')
  userEvent.click(addButton)

  const newTodoButton = screen.getByRole('button', { name: 'New Todo' })

  expect(newTodoButton).toBeVisible()
  expect(nameInput).toHaveValue('')
  expect(addButton).toHaveTextContent(/add № 2/i)
  expect(itemsLeftText).toHaveTextContent(/1 item left/i)
})

test('removes a todo when clicked on delete todo button', () => {
  render(<TodoApp />)
  const newTodoButton = addTodo('New Todo')
  const removeButton = screen.getByRole('button', { name: /×/i })

  userEvent.click(removeButton)
  expect(newTodoButton).not.toBeInTheDocument()
  expect(removeButton).not.toBeInTheDocument()

  const addButton = screen.getByRole('button', { name: /add № 1/i })
  const itemsLeftText = screen.getByText(/0 items left/i)

  expect(addButton).toBeVisible()
  expect(itemsLeftText).toBeVisible()
})

test("click on todo - toggles it's completed status", () => {
  render(<TodoApp />)
  const newTodoButton = addTodo('New Todo')
  const buttonClearCompleted = screen.getByRole('button', { name: /clear completed/i })

  userEvent.click(newTodoButton)

  expect(newTodoButton).toHaveStyle({ textDecoration: 'line-through' })
  expect(screen.getByText(/0 items left/i)).toBeVisible()
  expect(buttonClearCompleted).not.toBeDisabled()

  userEvent.click(newTodoButton)

  expect(newTodoButton).not.toHaveStyle({ textDecoration: 'line-through' })
  expect(buttonClearCompleted).toBeDisabled()
  expect(screen.getByText(/1 item left/i)).toBeVisible()
})

test('click on clear completed removes all completed todos', () => {
  render(<TodoApp />)
  const newTodoButton = addTodo('New Todo')
  const buttonClearCompleted = screen.getByRole('button', { name: /clear completed/i })

  userEvent.click(newTodoButton)

  expect(buttonClearCompleted).not.toBeDisabled()

  userEvent.click(buttonClearCompleted)

  expect(newTodoButton).not.toBeInTheDocument()
  expect(buttonClearCompleted).toBeDisabled()
})

test('filters', () => {
  render(<TodoApp />)
  const newTodoButton = addTodo('New Todo')
  const allFilterButton = screen.getByRole('tab', { name: /all/i })
  const activeFilterButton = screen.getByRole('tab', { name: /active/i })
  const completedFilterButton = screen.getByRole('tab', { name: /completed/i })

  userEvent.click(allFilterButton)
  expect(newTodoButton).toBeVisible()

  userEvent.click(activeFilterButton)
  expect(newTodoButton).toBeVisible()

  userEvent.click(completedFilterButton)
  expect(newTodoButton).not.toBeInTheDocument()

  userEvent.click(allFilterButton)
  userEvent.click(newTodoButton)

  // userEvent.click(allFilterButton)
  // expect(newTodoButton).toBeVisible()

  // userEvent.click(activeFilterButton)
  // expect(newTodoButton).not.toBeInTheDocument()

  // userEvent.click(completedFilterButton)
  // expect(newTodoButton).toBeVisible()
})
