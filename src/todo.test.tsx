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

test.todo("click on todo - toggles it's completed status")

test.todo('click on clear completed removes all completed todos')

test.todo('test filters')
