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
    </div>
  )
}

export default HomePage
