import React from 'react'
import { Link } from 'react-router-dom'

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-6xl font-bold text-olive-800 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-olive-700 mb-4">Page Not Found</h2>
      <Link
        to="/"
        className="bg-olive-600 text-white px-6 py-2 rounded-lg hover:bg-olive-700 transition-colors"
      >
        Go Back Home
      </Link>
    </div>
  )
}

export default NotFoundPage
