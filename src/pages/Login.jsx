import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../redux/authSlice";
import '../assets/login.css';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users } = useSelector((state) => state.auth);

  const handleLogin = (e) => {
    e.preventDefault();
    const userAccount = users[username];

    if (userAccount && userAccount.password === password) {
      // 로그인 성공 시 사용자 정보 전체를 넘겨줌
      dispatch(loginSuccess({
        username: username,
        nickname: userAccount.nickname,
        role: userAccount.role,
        hasCreatedGroup: userAccount.hasCreatedGroup,
        birthdate: userAccount.birthdate,
        profileImage: userAccount.profileImage,
      }));
      alert('로그인 되었습니다.');
      navigate('/mypage'); // 마이페이지로 이동
    } else {
      // 로그인 실패
      alert('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <div className="login-container">
      <h2>로그인</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="아이디"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">로그인</button>
      </form>
      <p>
        계정이 없으신가요? <Link to="/signup">회원가입</Link>
      </p>
    </div>
  );
}

export default Login;