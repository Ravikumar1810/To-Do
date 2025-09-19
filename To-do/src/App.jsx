import './App.css'
import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function App() {
  const [todos, setTodos] = useState(() => {
    try {
      const raw = localStorage.getItem('todos')
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  const [task, setTask] = useState('')

  const [editingId, setEditingId] = useState(null)
  const [editingText, setEditingText] = useState('')

  const editInputRef = useRef(null)

  useEffect(() => {
    try {
      localStorage.setItem('todos', JSON.stringify(todos))
    } catch {
    }
  }, [todos])

  useEffect(() => {
    if (editingId !== null && editInputRef.current) {
      editInputRef.current.focus()
      const len = editInputRef.current.value.length
      editInputRef.current.setSelectionRange(len, len)
    }
  }, [editingId])

  const generateId = () =>
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : Date.now().toString(36) + Math.random().toString(36).slice(2, 9)

  const addTodo = (e) => {
    e.preventDefault()
    const value = task.trim()
    if (!value) return
    setTodos((prev) => [...prev, { id: generateId(), text: value }])
    setTask('')
  }

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id))
    if (editingId === id) {
      setEditingId(null)
      setEditingText('')
    }
  }

  const startEdit = (id, text) => {
    setEditingId(id)
    setEditingText(text)
  }

  const saveEdit = (id) => {
    const value = editingText.trim()
    if (!value) {
      setEditingId(null)
      setEditingText('')
      return
    }
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, text: value } : t)))
    setEditingId(null)
    setEditingText('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingText('')
  }

  const onEditKeyDown = (e, id) => {
    if (e.key === 'Enter') {
      saveEdit(id)
    } else if (e.key === 'Escape') {
      cancelEdit()
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-300 p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Todo App</h1>

      <form onSubmit={addTodo} className="flex gap-2 items-center">
        <input
          aria-label="Add todo"
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter Todo..."
          className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          aria-label="Add todo"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Add
        </button>
      </form>

      {todos.length === 0 ? (
        <div className="mt-6 w-full max-w-md text-center text-gray-600 bg-white px-6 py-4 rounded-lg shadow">
          No tasks yet. Add your first one 
        </div>
      ) : (
        <ul className="mt-6 space-y-2 w-full max-w-md">
          <AnimatePresence>
            {todos.map((t) => (
              <motion.li
                key={t.id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                layout
                transition={{ duration: 0.18 }}
                className="bg-white px-4 py-3 rounded-lg shadow-md flex justify-between items-center"
              >
                {editingId === t.id ? (
                  <input
                    ref={editInputRef}
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onBlur={() => saveEdit(t.id)}
                    onKeyDown={(e) => onEditKeyDown(e, t.id)}
                    className="flex-1 border px-3 py-2 rounded mr-3"
                    aria-label={`Edit todo ${t.text}`}
                  />
                ) : (
                  <div className="flex-1 flex items-center gap-3">
                    <span
                      className="break-words"
                      onDoubleClick={() => startEdit(t.id, t.text)}
                    >
                      {t.text}
                    </span>
                    <button
                      onClick={() => startEdit(t.id, t.text)}
                      aria-label={`Edit todo ${t.text}`}
                      className="text-sm text-gray-500 hover:text-gray-700 transition ml-2"
                      type="button"
                    >
                      Edit
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => deleteTodo(t.id)}
                    aria-label={`Delete todo ${t.text}`}
                    className="text-red-500 hover:text-red-700"
                    type="button"
                  >
                    ✕
                  </button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  )
}

export default App
