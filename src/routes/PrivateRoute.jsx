import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  // 로그인 상태이면 요청된 페이지를 보여주고, 아니면 로그인 페이지로 리다이렉트
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;