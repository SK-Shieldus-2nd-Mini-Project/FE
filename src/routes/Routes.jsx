import { Routes, Route } from 'react-router-dom'

import MainPage from '../pages/MainPage.jsx'
import Login from "../pages/Login.jsx"
import Signup from '../pages/Signup.jsx'
<<<<<<< HEAD
import MyPage from '../pages/MyPage.jsx'
=======
import GroupCreation from '../pages/GroupCreation.jsx'
>>>>>>> 94bdc15 (update)
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
<<<<<<< HEAD
          path="/mypage"
          element={<MyPage />}
=======
          path="/groupcreation"
          element={<GroupCreation />}
>>>>>>> 94bdc15 (update)
        />
      </Routes>
      <Footer />
    </div>
  )
}