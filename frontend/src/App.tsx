import { useState, useEffect, useRef } from 'react'
import './App.css'

interface SSEMessage {
  character?: string
  position?: number
  total?: number
  message?: string
  total_characters?: number
}

function App() {
  const [text, setText] = useState('')
  const [streamedText, setStreamedText] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const eventSourceRef = useRef<EventSource | null>(null)

  const connectToSSE = (textToStream: string) => {
    // Close existing connection if any
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
    }

    // Reset state
    setStreamedText('')
    setProgress(0)
    setIsComplete(false)
    setIsConnected(false)

    // Create new EventSource connection
    const eventSource = new EventSource(`http://localhost:8000/sse?text=${encodeURIComponent(textToStream)}`)
    eventSourceRef.current = eventSource

    eventSource.onopen = () => {
      setIsConnected(true)
      console.log('SSE connection opened')
    }

    eventSource.onmessage = (event) => {
      try {
        const data: SSEMessage = JSON.parse(event.data)
        
        if (data.character) {
          // Add character to streamed text
          setStreamedText(prev => prev + data.character)
          setProgress(data.position || 0)
        } else if (data.message) {
          // Completion message - disconnect automatically
          setIsComplete(true)
          console.log('Streaming completed:', data.message)
          disconnect()
        }
      } catch (error) {
        console.error('Error parsing SSE message:', error)
      }
    }

    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error)
      setIsConnected(false)
    }

    return eventSource
  }

  const disconnect = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
      setIsConnected(false)
    }
  }

  const handleStream = () => {
    if (text.trim()) {
      connectToSSE(text.trim())
    }
  }

  const reset = () => {
    disconnect()
    setStreamedText('')
    setProgress(0)
    setIsComplete(false)
  }

  useEffect(() => {
    // Cleanup on component unmount
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
    }
  }, [])

  return (
    <div className="app">
      <header className="app-header">
        <h1>SSE Text Streamer</h1>
        <p>Stream text character by character using Server-Sent Events</p>
      </header>

      <div className="controls">
        <div className="text-input">
          <label htmlFor="textInput">Enter text to stream:</label>
          <textarea
            id="textInput"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message here..."
            disabled={isConnected}
            rows={3}
          />
        </div>

        <div className="connection-controls">
          {!isConnected ? (
            <button 
              onClick={handleStream} 
              className="stream-btn"
              disabled={!text.trim()}
            >
              Start Streaming
            </button>
          ) : (
            <button onClick={disconnect} className="disconnect-btn">
              Stop Streaming
            </button>
          )}
          
          <button onClick={reset} className="reset-btn">
            Reset
          </button>
          
          <div className="status">
            Status: <span className={isConnected ? 'connected' : 'disconnected'}>
              {isConnected ? 'Streaming' : 'Ready'}
            </span>
          </div>
        </div>
      </div>

      <div className="stream-container">
        <div className="stream-header">
          <h2>Streamed Text</h2>
          {text && (
            <div className="progress-info">
              <span className="progress-text">
                {progress} / {text.length} characters
              </span>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${text.length > 0 ? (progress / text.length) * 100 : 0}%` }}
                />
              </div>
            </div>
          )}
        </div>
        
        <div className="streamed-text">
          {streamedText ? (
            <div className="text-display">
              {streamedText.split('').map((char, index) => (
                <span 
                  key={index} 
                  className="character"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {char}
                </span>
              ))}
            </div>
          ) : (
            <p className="no-text">No text streamed yet. Enter text above and click "Start Streaming".</p>
          )}
        </div>

        {isComplete && (
          <div className="completion-message">
            ✅ Streaming completed! All {text.length} characters have been streamed.
          </div>
        )}
      </div>
    </div>
  )
}

export default App
