import React from "react";
import { useSelector } from "react-redux";

export default function MyActivities() {
  const myApplications = useSelector(state => state.applications.myApplications);

  return (
    <div className="content-panel">
      <h2>내 활동</h2>
      <p>모임 가입 신청 현황을 확인합니다.</p>
      <ul className="status-list">
        {myApplications.length === 0 ? (
          <p>아직 신청한 모임이 없습니다.</p>
        ) : (
          myApplications.map((app, index) => (
            <li
              key={index}
              className={`status-${
                app.status.includes("완료")
                  ? "approved"
                  : app.status.includes("대기")
                  ? "pending"
                  : "rejected"
              }`}
            >
              <span className="group-name">{app.groupName}</span>
              <span className="status-badge">{app.status}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}