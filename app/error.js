'use client'

import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="rounded-full bg-red-100 p-4">
            <AlertTriangle className="h-12 w-12 text-red-600" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">Something Went Wrong</h1>
          <p className="text-lg text-gray-600">
            We encountered an unexpected error.
          </p>
        </div>
      </div>
    </div>
  )
}
