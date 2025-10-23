import { useState } from 'react'
import './App.css'

function App() {
  const [question, setQuestion] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchQuestion = async () => {
    setLoading(true)
    setQuestion("Loading...")

    try {
      const response = await fetch('https://opentdb.com/api.php?amount=1')

      if (response.status === 429) {
        setQuestion("Please try again in a moment.")
        setLoading(false)
        return
      }

      if (!response.ok) {
        setQuestion("Error fetching question.")
        setLoading(false)
        return
      }

      const data = await response.json()
      const result = data.results?.[0]
      if (result) {
        const decoded = decodeHtml(result.question)
        setQuestion(decoded)
      } else {
        setQuestion("No question available.")
      }
    } catch (error) {
      setQuestion("Error fetching question.")
    } finally {
      setLoading(false)
    }
  }

  const decodeHtml = (html: string) => {
    const txt = document.createElement("textarea")
    txt.innerHTML = html
    return txt.value
  }

  return (
    <div className="app">
      <h1>Trivia App</h1>
      <p>{question ? question : "Click the button to get a trivia question!"}</p>
      <button onClick={fetchQuestion} disabled={loading}>
        {loading ? "Fetching..." : "Get Trivia Question"}
      </button>
    </div>
  )
}

export default App
