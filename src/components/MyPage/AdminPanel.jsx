import React from 'react';

export default function AdminPanel() {
  return (
    <div className="content-panel">
      <h2>관리자 페이지</h2>
      <p>서비스의 모임과 회원을 관리합니다.</p>
      <div className="admin-menu">
        <div className="admin-menu-item">
            <h3>승인 대기 모임</h3>
            <p>새로 생성된 모임의 게시를 승인하거나 거절합니다.</p>
            <button>관리하기</button>
        </div>
        <div className="admin-menu-item">
            <h3>전체 회원 관리</h3>
            <p>서비스를 이용하는 모든 회원을 관리합니다.</p>
            <button>관리하기</button>
        </div>
      </div>
    </div>
  );
}