import { Routes, Route } from 'react-router-dom'

import MainPage from '../pages/MainPage.jsx'
import Login from "../pages/Login.jsx"
import Signup from '../pages/Signup.jsx'
import MyPage from '../pages/MyPage.jsx'
import GroupCreation from '../pages/GroupCreation.jsx'
import GroupDetail from '../pages/GroupDetail.jsx'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import PrivateRoute from './PrivateRoute.jsx'

export default function Router() {
  return (
    <div className="PageContainer">
      <Nav />
      <Routes>
        <Route path='/' element={<MainPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/groupcreation" element={<GroupCreation />} />
        <Route path="/groups/:id" element={<GroupDetail />} />
      </Routes>
      <Footer />
    </div>
  )
}
