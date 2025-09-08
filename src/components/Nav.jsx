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
            <ul>
                <li>
                    <Link to="/" className='logo-li'>
                        <img src="/public/logo.png" alt="오운고" className='logo' />
                    </Link>
                    </li>
                <div className='right-nav'>
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
                </div>
            </ul>
        </nav>
    );
}

export default Nav;