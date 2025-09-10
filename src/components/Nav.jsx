import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import '../assets/Nav.css';

function Nav() {
    const { isAuthenticated } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        alert('로그아웃 되었습니다.');
        navigate('/');
    };

    return (
        <nav className='main-nav'>
            <div className='logo-container'>
                <Link to="/">
                    <img src="/logo.png" alt="오운고" className='logo' />
                </Link>
            </div>
            <ul className='nav-links'>
                {isAuthenticated ? (
                    <>
                        <li><Link to="/mypage">마이페이지</Link></li>
                        <li><a onClick={handleLogout} className="logout-btn">로그아웃</a></li>
                    </>
                ) : (
                    <>
                        <li><Link to="/login">로그인</Link></li>
                        <li><Link to="/signup">회원가입</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
}

export default Nav;