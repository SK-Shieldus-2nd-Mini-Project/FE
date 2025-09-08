import React, { useState } from "react";
import InputField from "./InputField";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal"; // 모달 컴포넌트 불러오기
import '../assets/Modal.css'; // 모달 CSS 불러오기
import { validateGroupForm } from '../utils/validateGroupForm';

function GroupForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    maxMembers: "",
    region: "",
    sport: "",
  });

  const [showModal, setShowModal] = useState(false); // 1. 모달 표시 상태 추가
  const navigate = useNavigate(); // useNavigate 훅 사용

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const error = validateGroupForm(formData);
    if (error) {
      alert(error);
      return;
    }
    console.log("모임 생성 데이터:", formData);

    // 2. 모임 생성 성공 시 모달을 띄웁니다.
    // 기존 alert()를 이 코드로 대체합니다.
    setShowModal(true);
  };
  
  const handleCloseModal = () => {
    // 3. 모달을 닫는 함수
    setShowModal(false);
    // 4. 모달이 닫히면 메인 페이지로 이동
    navigate("/"); 
  };

  return (
    <> {/* Fragment로 감싸기 */}
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

    {/* 5. 모임 생성 완료 모달 추가 */}
      <Modal
        show={showModal}
        onClose={handleCloseModal}
        title="모임 생성 완료!"
        message="새로운 모임이 성공적으로 만들어졌습니다."
      >
        <button onClick={handleCloseModal} className="modal-ok-btn">확인</button>
      </Modal>
    </>
  );
}

export default GroupForm;