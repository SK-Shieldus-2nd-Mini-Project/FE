import React from "react";
import GroupCard from "./GroupCard";

const GroupList = ({ groups }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {groups.map((group) => (
        <GroupCard key={group.id} group={group} />
      ))}
    </div>
  );
};

export default GroupList;