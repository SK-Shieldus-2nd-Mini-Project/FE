import React from "react";
import GroupCard from "./GroupCard";

const RecommendedGroups = ({ groups }) => {
  const recommended = groups.slice(0, 3); // 예시: 첫 3개 추천
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">추천 모임</h2>
      <div className="flex gap-4 overflow-x-auto">
        {recommended.map((group) => (
          <GroupCard key={group.id} group={group} />
        ))}
      </div>
    </div>
  );
};

export default RecommendedGroups;