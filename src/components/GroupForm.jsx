import React, { useState } from "react";
import InputField from "./InputField";

function GroupForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    maxMembers: "",
    region: "",
    sport: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("모임 생성 데이터:", formData);
    alert("모임이 생성되었습니다!");
  };

  return (
    <form className="group-form" onSubmit={handleSubmit}>
      <h2 className="form-title">모임 모집하기</h2>
      
      <InputField label="모임 이름" name="name" value={formData.name} onChange={handleChange} />
      <InputField label="모임 설명" name="description" value={formData.description} onChange={handleChange} type="textarea" />
      <InputField label="최대 인원" name="maxMembers" value={formData.maxMembers} onChange={handleChange} type="number" />

      {/* 지역 선택 */}
      <div className="input-field">
        <label htmlFor="region">지역</label>
        <select id="region" name="region" value={formData.region} onChange={handleChange}>
          <option value="">지역 선택</option>
          <option value="서울">서울</option>
          <option value="경기">경기</option>
          <option value="인천">인천</option>
        </select>
      </div>

      {/* 종목 선택 */}
      <div className="input-field">
        <label htmlFor="sport">종목</label>
        <select id="sport" name="sport" value={formData.sport} onChange={handleChange}>
          <option value="">종목 선택</option>
          <option value="조깅">조깅</option>
          <option value="농구">농구</option>
          <option value="등산">등산</option>
          <option value="자전거">자전거</option>
        </select>
      </div>

      <button type="submit" className="submit-btn">생성하기</button>
    </form>
  );
}

export default GroupForm;