import React from "react";

const FilterBar = ({ filter, setFilter }) => {
  return (
    <div className="flex gap-4 mb-6">
      <select
        className="border p-2 rounded"
        value={filter.region}
        onChange={(e) => setFilter({ ...filter, region: e.target.value })}
      >
        <option value="">지역 선택</option>
        <option value="서울">서울</option>
        <option value="부산">부산</option>
      </select>
      <select
        className="border p-2 rounded"
        value={filter.category}
        onChange={(e) => setFilter({ ...filter, category: e.target.value })}
      >
        <option value="">종목 선택</option>
        <option value="러닝">러닝</option>
        <option value="헬스">헬스</option>
        <option value="요가">요가</option>
      </select>
    </div>
  );
};

export default FilterBar;