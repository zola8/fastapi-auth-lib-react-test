import { Outlet, Link } from 'react-router-dom'
import Footer from './Footer'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-olive-50">
      <nav className="bg-olive-200 shadow-md border-b border-olive-300">
        <div className="max-w-8/10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8 items-center">
              <h1 className="text-xl font-bold text-olive-800">
                FastAPI-Auth-Lib-React-Test
              </h1>
              <div className="flex space-x-4">
                <Link
                  to="/"
                  className="text-olive-700 hover:text-olive-900 px-3 py-2 rounded-md text-sm font-medium hover:bg-olive-300/50 transition-colors"
                >
                  Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-8/10 mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}
