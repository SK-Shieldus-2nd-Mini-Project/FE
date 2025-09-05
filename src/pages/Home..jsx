import React, { useState } from "react";
import { groups } from "../data/groups";
import FilterBar from "../components/FiterBar";
import GroupList from "../components/GroupList";
import RecommendedGroups from "../components/RecommendedGroup";

const Home = () => {
  const [filter, setFilter] = useState({ region: "", category: "" });

  const filteredgroups = groups.filter(
    (m) =>
      (filter.region === "" || m.region === filter.region) &&
      (filter.category === "" || m.category === filter.category)
  );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">모집중인 운동 모임</h1>
      
      {/* 필터 */}
      <FilterBar filter={filter} setFilter={setFilter} />

      {/* 추천 모임 */}
      <RecommendedGroups groups={groups} />

      {/* 모임 리스트 */}
      <GroupList groups={filteredgroups} />
    </div>
  );
};

export default Home;