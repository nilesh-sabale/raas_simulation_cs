import React from 'react'
import ReactDOM from 'react-dom/client'

function SimpleApp() {
    return (
        <div style={{
            padding: '20px',
            fontFamily: 'Arial, sans-serif',
            background: '#0a0a0f',
            color: '#f9fafb',
            minHeight: '100vh'
        }}>
            <h1>RaaS Simulation - Test</h1>
            <p>If you can see this, React is working!</p>
            <button onClick={() => alert('Button works!')}>
                Test Button
            </button>
        </div>
    )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<SimpleApp />)