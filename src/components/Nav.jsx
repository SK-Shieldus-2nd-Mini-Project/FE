import { Link } from 'react-router-dom';
import '../assets/Nav.css';

function Nav() {
    return (
        <nav className='main-nav'>
            <ul>
                <li>
                    <Link to="/">로고</Link>
                </li>
                <div className='right-nav'>
                    <li>
                        <Link to="/mypage">마이페이지</Link>
                    </li>
                    <li>
                        <Link to="/login">로그인</Link>
                    </li>
                    <li>
                        <Link to="/signup">회원가입</Link>
                    </li>
                </div>
            </ul>
        </nav>
    );
}

export default Nav;