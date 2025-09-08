import React from "react";
import { useSelector } from "react-redux";
import '../../assets/MyPage/MyActivities.css';

export default function MyActivities() {
  const myApplications = useSelector(state => state.applications.myApplications);

  // 중복 제거: groupName 기준으로 필터링
  const uniqueApplications = Array.from(
    new Map(myApplications.map(app => [app.groupName, app])).values()
  );

  if (uniqueApplications.length === 0) {
    return (
      <div className="content-panel">
        <h2>내 활동</h2>
        <p>모임 가입 신청 현황을 확인합니다.</p>
        <div className="no-activities">아직 신청한 모임이 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="content-panel">
      <h2>내 활동</h2>
      <p>모임 가입 신청 현황을 확인합니다.</p>
      <div className="card-list">
        {uniqueApplications.map((app) => (
          <div
            key={app.id} // 고유 ID 사용
            className={`activity-card ${
              app.status.includes("완료")
                ? "approved"
                : app.status.includes("대기")
                ? "pending"
                : "rejected"
            }`}
          >
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