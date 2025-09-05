import { Routes, Route } from 'react-router-dom'

import MainPage from '../pages/MainPage.jsx'
<<<<<<< HEAD
import Login from "../pages/Login.jsx"
import Signup from '../pages/Signup.jsx'
=======
>>>>>>> origin/main
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'

export default function Router() {
  return (
    <div className="PageContainer">
      <Nav />
      <Routes>
        <Route
          path='/'
          element={<MainPage />}
        />
<<<<<<< HEAD
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
=======
>>>>>>> origin/main
      </Routes>
      <Footer />
    </div>
  )
}
