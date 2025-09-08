import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import '../../assets/MyPage/MyActivities.css';

export default function MyActivities() {
  const navigate = useNavigate();

  // 더미 데이터 예시
  const myApplications = useSelector(state => state.applications.myApplications) || [
    { id: 1, groupName: "조깅 크루", status: "완료", imageUrl: "https://via.placeholder.com/250x140", description: "매일 아침 7시" },
    { id: 2, groupName: "요가 모임", status: "대기", imageUrl: "https://via.placeholder.com/250x140", description: "주 2회" },
    { id: 3, groupName: "조깅 크루", status: "대기", imageUrl: "https://via.placeholder.com/250x140", description: "중복 테스트" }
  ];

  // 중복 제거 (groupName 기준, 완료 > 대기 > 거절 우선)
  const appMap = new Map();
  myApplications.forEach(app => {
    const existing = appMap.get(app.groupName);
    if (!existing) {
      appMap.set(app.groupName, app);
    } else {
      // 상태 우선순위: 완료 > 대기 > 거절
      const priority = { "완료": 3, "대기": 2, "거절": 1 };
      if ((priority[app.status] || 0) > (priority[existing.status] || 0)) {
        appMap.set(app.groupName, app);
      }
    }
  });
  const uniqueApplications = Array.from(appMap.values());

  if (uniqueApplications.length === 0) {
    return (
      <div className="content-panel">
        <h2>내 활동</h2>
        <p>모임 가입 신청 현황을 확인합니다.</p>
        <div className="no-activities">아직 신청한 모임이 없습니다.</div>
      </div>
    );
  }

  const handleCardClick = (groupId) => {
    navigate(`/grouplist/${groupId}`); // 클릭 시 해당 그룹 상세/목록 페이지 이동
  }

  return (
    <div className="content-panel">
      <h2>내 활동</h2>
      <p>모임 가입 신청 현황을 확인합니다.</p>
      <div className="card-list">
        {uniqueApplications.map((app) => (
          <div
            key={app.id} // 고유 key
            className={`activity-card ${
              app.status.includes("완료")
                ? "approved"
                : app.status.includes("대기")
                ? "pending"
                : "rejected"
            }`}
            onClick={() => handleCardClick(app.id)}
            style={{ cursor: "pointer" }}
          >
            <div className="card-image">
              <img src={app.imageUrl || "https://via.placeholder.com/250x140"} alt={app.groupName} />
            </div>
            <div className="card-header">
              <span className="group-name">{app.groupName}</span>
              <span className="status-badge">{app.status}</span>
            </div>
            <div className="card-body">
              <p>{app.description || "설명 없음"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}