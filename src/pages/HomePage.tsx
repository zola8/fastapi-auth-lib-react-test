import React from 'react'

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[20vh] px-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-olive-800 mb-4 text-center">
          Welcome to FastAPI Auth Lib
        </h1>

        <p className="text-lg text-olive-600 mb-8 text-center">
          A React testing application for FastAPI authentication library
        </p>

        <p className="text-lg text-olive-600 mb-4">
          <a
            href="/register-password"
            className="text-olive-700 font-semibold underline hover:text-olive-900 hover:no-underline transition duration-200"
          >
            01.a) Register with password
          </a>
          <br />
          The first step of Registration Workflow can be the 'register with password'.
        </p>

        <p className="text-lg text-olive-600 mb-4">
          <a
            href="/activate-account"
            className="text-olive-700 font-semibold underline hover:text-olive-900 hover:no-underline transition duration-200"
          >
            02. Activate account
          </a>
          <br />
          After the registration (in email) you received an activation token, to activate your user profile.
        </p>

        <p className="text-lg text-olive-600 mb-4">
          <a
            href="/resend-activation"
            className="text-olive-700 font-semibold underline hover:text-olive-900 hover:no-underline transition duration-200"
          >
            03. Re-send activation
          </a>
          <br />
          The activation token can expire or lost. You might need to re-send the activation.
        </p>

        <p className="text-lg text-olive-600 mb-4">
          <a
            href="/forgot-reset-password"
            className="text-olive-700 font-semibold underline hover:text-olive-900 hover:no-underline transition duration-200"
          >
            04. Forgot & Reset Password
          </a>
          <br />
          Oooops, I forgot my password! I must request a change, then perform the change.
        </p>

      </div>
    </div>
  )
}

export default HomePage
