import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { Toaster } from './components/Toaster'
import Home from './pages/Home/Home'
import SignInPage from './pages/Auth/SignInPage'
import SignUpPage from './pages/Auth/SignUpPage'
import KonfiguratorPage from './pages/Konfigurator/KonfiguratorPage'
import BestellungBestaetigung from './pages/Bestellung/BestellungBestaetigung'

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<SignInPage />} />
        <Route path="/registrierung" element={<SignUpPage />} />
        <Route path="/konfigurator" element={<KonfiguratorPage />} />
        <Route path="/bestellung/bestaetigung" element={<BestellungBestaetigung />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
