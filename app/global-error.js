'use client'

import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global application error:', error)
  }, [error])

  return (
    <html lang="en">
      <body className="bg-white antialiased">
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
          <div className="text-center space-y-6 max-w-md">
            <div className="flex justify-center">
              <div className="rounded-full bg-red-100 p-4">
                <AlertTriangle className="h-12 w-12 text-red-600" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-gray-900">Critical Error</h1>
              <p className="text-lg text-gray-600">
                A critical error occurred. Please refresh the page.
              </p>
            </div>

            <div className="flex justify-center pt-4">
              <button
                onClick={reset}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
