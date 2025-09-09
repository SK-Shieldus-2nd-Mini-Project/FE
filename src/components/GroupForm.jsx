// src/components/GroupForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "./InputField";
import GroupFormModal from "./GroupFormModal"; // 새 모달 import
import '../assets/Modal.css';

function GroupForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    maxMembers: "",
    region: "",
    sport: "",
  });

  const [showModal, setShowModal] = useState(false); // 모달 상태
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ 테스트용: validateGroupForm 잠시 주석
    // const error = validateGroupForm(formData);
    // if (error) {
    //   alert(error);
    //   return;
    // }

    console.log("모임 생성 데이터:", formData);
    setShowModal(true); // 모달 열기
  };
  
  const handleCloseModal = () => {
    setShowModal(false); // 모달 닫기
    navigate("/");       // 메인 페이지 이동
  };

  return (
    <>
      <form className="group-form" onSubmit={handleSubmit}>
        <h2 className="form-title">모임 모집하기</h2>
        
        <InputField label="모임 이름" name="name" value={formData.name} onChange={handleChange} />
        <InputField label="모임 설명" name="description" value={formData.description} onChange={handleChange} type="textarea" />
        <InputField label="최대 인원" name="maxMembers" value={formData.maxMembers} onChange={handleChange} type="number" />

        <div className="input-field">
          <label htmlFor="region">지역</label>
          <select id="region" name="region" value={formData.region} onChange={handleChange}>
            <option value="">지역 선택</option>
            <option value="서울">서울</option>
            <option value="경기">경기</option>
            <option value="인천">인천</option>
          </select>
        </div>

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

      {/* 모임 생성 완료 모달 */}
      <GroupFormModal
        show={showModal}
        onClose={handleCloseModal}
        message="새로운 모임이 성공적으로 만들어졌습니다."
      >
        <button className="modal-ok-btn">확인</button>
      </GroupFormModal>
    </>
  );
}

export default GroupForm;
