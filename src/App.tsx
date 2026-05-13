import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Header } from './components/Header'
import Home from './pages/Home'
import SignInPage from './pages/Auth/SignInPage'
import SignUpPage from './pages/Auth/SignUpPage'

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<SignInPage />} />
        <Route path="/registrierung" element={<SignUpPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
