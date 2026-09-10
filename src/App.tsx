import { Route, Routes } from 'react-router-dom'
import ActivationPage from './pages/ActivationPage'
import ForgotResetPasswordPage from './pages/ForgotResetPassword'
import HomePage from './pages/HomePage'
import Layout from './pages/Layout'
import NotFoundPage from './pages/NotFound'
import RegistrationWithPasswordPage from './pages/RegistrationWithPasswordPage'
import ReSendActivationPage from './pages/ReSendActivationPage'
import LoginWithPasswordPage from './pages/LoginWithPasswordPage'
import MyProfilePage from './pages/MyProfilePage'
import LogoutPage from './pages/LogoutPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />

        <Route path="/register-password" element={<RegistrationWithPasswordPage />} />
        <Route path="/activate-account" element={<ActivationPage />} />
        <Route path="/resend-activation" element={<ReSendActivationPage />} />
        <Route path="/forgot-reset-password" element={<ForgotResetPasswordPage />} />
        <Route path="/login-password" element={<LoginWithPasswordPage />} />
        <Route path="/me" element={<MyProfilePage />} />
        <Route path="/logout" element={<LogoutPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
