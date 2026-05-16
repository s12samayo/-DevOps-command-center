 import { useEffect, useState } from 'react'
  import './App.css'

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'

  const initialForm = {
    category: '',
    command: '',
    description: '',
  }

  function App() {
    const [commands, setCommands] = useState([])
    const [status, setStatus] = useState('loading')
    const [error, setError] = useState('')
    const [form, setForm] = useState(initialForm)
    const [formStatus, setFormStatus] = useState('idle')
    const [formMessage, setFormMessage] = useState('')
    const [editingCommandId, setEditingCommandId] = useState(null)

    async function loadCommands() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/commands`)

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`)
        }

        const data = await response.json()
        setCommands(data)
        setStatus('success')
      } catch (err) {
        setError(err.message)
        setStatus('error')
      }
    }

    useEffect(() => {
      loadCommands()
    }, [])

    function handleInputChange(event) {
      const { name, value } = event.target

      setForm((currentForm) => ({
        ...currentForm,
        [name]: value,
      }))
    }

    function handleEditCommand(commandItem) {
      setEditingCommandId(commandItem.id)
      setForm({
        category: commandItem.category,
        command: commandItem.command,
        description: commandItem.description,
      })
      setFormStatus('idle')
      setFormMessage('')
    }

    function handleCancelEdit() {
      setEditingCommandId(null)
      setForm(initialForm)
      setFormStatus('idle')
      setFormMessage('')
    }

    async function handleDeleteCommand(id) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/commands/${id}`, {
          method: 'DELETE',
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Failed to delete command')
        }

        setCommands((currentCommands) =>
          currentCommands.filter((item) => item.id !== id)
        )
      } catch (err) {
        setFormStatus('error')
        setFormMessage(err.message)
      }
    }

    async function handleSubmit(event) {
      event.preventDefault()
      setFormStatus('submitting')
      setFormMessage('')

      const isEditing = editingCommandId !== null
      const url = isEditing
        ? `${API_BASE_URL}/api/commands/${editingCommandId}`
        : `${API_BASE_URL}/api/commands`

      try {
        const response = await fetch(url, {
          method: isEditing ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Failed to save command')
        }

        if (isEditing) {
          setCommands((currentCommands) =>
            currentCommands.map((item) => (item.id === data.id ? data : item))
          )
          setEditingCommandId(null)
          setFormMessage('Command updated.')
        } else {
          setCommands((currentCommands) => [...currentCommands, data])
          setFormMessage('Command saved.')
        }

        setForm(initialForm)
        setFormStatus('success')
      } catch (err) {
        setFormStatus('error')
        setFormMessage(err.message)
      }
    }

    return (
      <main className="app-shell">
        <section className="intro">
          <p className="eyebrow">DevOps Command Center</p>
          <h1>Practice Linux, Git, Docker, and deployment workflows.</h1>
          <p className="intro-copy">
            This first screen proves the React frontend can talk to the Node.js
            backend API. The command data below is now stored in PostgreSQL.
          </p>
        </section>

        <section className="status-panel" aria-live="polite">
          <span className={`status-dot ${status}`}></span>
          <div>
            <h2>Backend Connection</h2>
            <p>
              {status === 'loading' && 'Loading command data from the API...'}
              {status === 'success' &&
                `Connected. Loaded ${commands.length} commands from PostgreSQL.`}
              {status === 'error' && `Connection failed: ${error}`}
            </p>
          </div>
        </section>

        <section className="command-form-section">
          <div className="section-heading">
            <h2>{editingCommandId ? 'Edit Command' : 'Add A Command'}</h2>
            <p>
              {editingCommandId
                ? 'Update the selected command in the PostgreSQL database.'
                : 'Save a new learning command into the PostgreSQL database.'}
            </p>
          </div>

          <form className="command-form" onSubmit={handleSubmit}>
            <label>
              Category
              <input
                name="category"
                value={form.category}
                onChange={handleInputChange}
                placeholder="Linux"
                required
              />
            </label>

            <label>
              Command
              <input
                name="command"
                value={form.command}
                onChange={handleInputChange}
                placeholder="pwd"
                required
              />
            </label>

            <label>
              Description
              <textarea
                name="description"
                value={form.description}
                onChange={handleInputChange}
                placeholder="Prints the current working directory."
                required
              />
            </label>

            <div className="form-actions">
              <button type="submit" disabled={formStatus === 'submitting'}>
                {formStatus === 'submitting'
                  ? 'Saving...'
                  : editingCommandId
                    ? 'Update Command'
                    : 'Save Command'}
              </button>

              {editingCommandId && (
                <button
                  className="secondary-button"
                  type="button"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
              )}
            </div>

            {formMessage && (
              <p className={`form-message ${formStatus}`}>{formMessage}</p>
            )}
          </form>
        </section>

        <section className="commands-section">
          <div className="section-heading">
            <h2>Command Library</h2>
            <p>These records are loaded from the PostgreSQL database.</p>
          </div>

          <div className="command-grid">
            {commands.map((item) => (
              <article className="command-card" key={item.id}>
                <div className="command-card-header">
                  <span className="category">{item.category}</span>
                  <div className="command-card-actions">
                    <button
                      className="edit-button"
                      type="button"
                      onClick={() => handleEditCommand(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-button"
                      type="button"
                      onClick={() => handleDeleteCommand(item.id)}
                      aria-label={`Delete ${item.command}`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <code>{item.command}</code>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    )
  }

  export default App