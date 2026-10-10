import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
        <h1 style={{ color: '#b91c1c' }}>Something crashed</h1>
        <pre style={{ whiteSpace: 'pre-wrap', background: '#fee2e2', padding: 16 }}>
          {String(this.state.error?.stack || this.state.error)}
        </pre>
      </div>
    )
  }
}