import { Component } from 'react'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gray-50 dark:bg-[#121212] text-gray-900 dark:text-gray-100">
          <div className="max-w-md w-full glass rounded-3xl p-8 flex flex-col gap-4 text-center items-center shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'Fraunces, Georgia, serif' }}>Something went wrong</h1>
            <p className="text-sm opacity-70 mb-4">
              We encountered an unexpected error while rendering this page.
            </p>
            <button 
              onClick={() => { this.setState({ hasError: false }); window.location.href = '/'; }}
              className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-semibold shadow-lg hover:scale-105 transition-transform"
            >
              Return to Home
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
