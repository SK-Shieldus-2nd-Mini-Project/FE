import React from "react";
import GroupForm from "../components/GroupForm";
import "../assets/groupCreation.css";

function GroupCreation() {
  return (
    <div className="group-page">
      <h1 className="page-title">모임 생성</h1>
      <GroupForm />
    </div>
  );
}

export default GroupCreation;