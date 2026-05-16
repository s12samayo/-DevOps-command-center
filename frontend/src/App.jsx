import { useEffect, useState } from 'react'
import './App.css'

const API_BASE_URL = 'http://localhost:4000'

function App() {
  const [commands, setCommands] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')

  useEffect(() => {
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

    loadCommands()
  }, [])

  return (
    <main className="app-shell">
      <section className="intro">
        <p className="eyebrow">DevOps Command Center</p>
        <h1>Practice Linux, Git, Docker, and deployment workflows.</h1>
        <p className="intro-copy">
          This first screen proves the React frontend can talk to the Node.js
          backend API. The command data below is coming from the backend service
          running on port 4000.
        </p>
      </section>

      <section className="status-panel" aria-live="polite">
        <span className={`status-dot ${status}`}></span>
        <div>
          <h2>Backend Connection</h2>
          <p>
            {status === 'loading' && 'Loading command data from the API...'}
            {status === 'success' &&
              `Connected. Loaded ${commands.length} starter commands.`}
            {status === 'error' && `Connection failed: ${error}`}
          </p>
        </div>
      </section>

      <section className="commands-section">
        <div className="section-heading">
          <h2>Starter Command Library</h2>
          <p>These are the first records served by our backend API.</p>
        </div>

        <div className="command-grid">
          {commands.map((item) => (
            <article className="command-card" key={item.id}>
              <span className="category">{item.category}</span>
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
