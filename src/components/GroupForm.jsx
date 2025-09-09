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

        {/* 종목 선택 */}
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