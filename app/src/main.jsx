import React from 'react'
import ReactDOM from 'react-dom/client'
import SocialBladeLive from './App.jsx'

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(e) { return { error: e }; }
  render() {
    if (this.state.error) {
      return (
        <pre style={{ color: 'red', padding: 20, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {String(this.state.error)}{'\n\n'}{this.state.error?.stack}
        </pre>
      );
    }
    return this.props.children;
  }
}

window._setStage && window._setStage('Starting React');
ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <SocialBladeLive />
  </ErrorBoundary>
)
