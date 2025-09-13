import { Routes, Route } from 'react-router-dom'

import MainPage from '../pages/MainPage.jsx'
import Login from "../pages/Login.jsx"
import Signup from '../pages/Signup.jsx'
import MyPage from '../pages/MyPage.jsx'
import GroupForm from '../components/GroupForm.jsx'
import GroupDetail from '../pages/GroupDetail.jsx'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import PrivateRoute from './PrivateRoute.jsx'

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
        <Route element={<PrivateRoute />}>
          <Route
            path="/mypage"
            element={<MyPage />}
          />
        </Route>
        <Route
          path="/groupcreation"
          element={<GroupForm />}
        />
        <Route
          path="/groups/:id"
          element={<GroupDetail />}
        />
      </Routes>
      <Footer />
    </div>
  )
}