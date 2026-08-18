import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Layout from './pages/Layout'
import NotFoundPage from './pages/NotFound'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
