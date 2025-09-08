import { Routes, Route } from 'react-router-dom'

import MainPage from '../pages/MainPage.jsx'
import Login from "../pages/Login.jsx"
import Signup from '../pages/Signup.jsx'
import GroupCreation from '../pages/GroupCreation.jsx'
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
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/signup"
          element={<Signup />}
        />
        <Route
          path="/groupcreation"
          element={<GroupCreation />}
        />
      </Routes>
      <Footer />
    </div>
  )
}