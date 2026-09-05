import React from 'react'

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center">

      <h1 className="text-4xl font-bold text-olive-800 mb-4">
        Welcome to FastAPI Auth Lib
      </h1>

      <p className="text-lg text-olive-600 mb-8">
        A React testing application for FastAPI authentication library
      </p>

      <p className="text-lg text-olive-600 mb-4">
        Ready to test registration? {' '}
        <a
          href="/register-password"
          className="text-olive-700 font-semibold underline hover:text-olive-900 hover:no-underline transition duration-200"
        >
          Register with password
        </a>
      </p>

    </div>
  )
}

export default HomePage
