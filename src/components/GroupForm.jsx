// src/components/GroupForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "./InputField";
import GroupFormModal from "./GroupFormModal"; 
import { validateGroupForm } from "../utils//validateGroupForm"; // 검증 함수 import
import '../assets/Modal.css';

function GroupForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    maxMembers: "",
    region: "",
    sport: "",
  });

  const [showModal, setShowModal] = useState(false); 
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

    // ✅ 검증 함수 사용
    const error = validateGroupForm(formData);
    if (error) {
      alert(error);
      return;
    }

    console.log("모임 생성 데이터:", formData);
    setShowModal(true); // 모달 열기
  };
  
  const handleCloseModal = () => {
    setShowModal(false); 
    navigate("/");       
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
            <option value="강남구">강남구</option>
            <option value="강동구">강동구</option>
            <option value="강북구">강북구</option>
            <option value="강서구">강서구</option>
            <option value="관악구">관악구</option>
            <option value="광진구">광진구</option>
            <option value="구로구">구로구</option>
            <option value="금천구">금천구</option>
            <option value="노원구">노원구</option>
            <option value="도봉구">도봉구</option>
            <option value="동대문구">동대문구</option>
            <option value="동작구">동작구</option>
            <option value="마포구">마포구</option>
            <option value="서대문구">서대문구</option>
            <option value="서초구">서초구</option>
            <option value="성동구">성동구</option>
            <option value="성북구">성북구</option>
            <option value="송파구">송파구</option>
            <option value="양천구">양천구</option>
            <option value="영등포구">영등포구</option>
            <option value="용산구">용산구</option>
            <option value="은평구">은평구</option>
            <option value="종로구">종로구</option>
            <option value="중구">중구</option>
            <option value="중량구">중량구</option>
          </select>
        </div>

        <div className="input-field">
          <label htmlFor="sport">종목</label>
          <select id="sport" name="sport" value={formData.sport} onChange={handleChange}>
            <option value="">종목 선택</option>
            <option value="러닝">러닝</option>
            <option value="자전거">자전거</option>
            <option value="농구">농구</option>
            <option value="야구">야구</option>
            <option value="축구">축구</option>
            <option value="배드민턴">배드민턴</option>
            <option value="족구">족구</option>
            <option value="테니스">테니스</option>
            <option value="볼링">볼링</option>
            <option value="탁구">탁구</option>
          </select>
        </div>

        <button type="submit" className="submit-btn">생성하기</button>
      </form>

      <GroupFormModal
        show={showModal}
        onClose={handleCloseModal}
        message="새로운 모임이 성공적으로 만들어졌습니다."
      >
        <div
          className="modal-content"
          style={{
            padding: '40px 30px',       
            borderRadius: '12px',
            backgroundColor: '#fff',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '18px', marginBottom: '30px' }}>
            새로운 모임이 성공적으로 만들어졌습니다.
          </p>
          <button
            onClick={handleCloseModal}
            style={{
              backgroundColor: '#3CD0B5',
              color: '#fff',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 20px',    
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            확인
          </button>
        </div>
      </GroupFormModal>
    </>
  );
}

export default GroupForm;