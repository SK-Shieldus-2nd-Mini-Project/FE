// src/components/GroupForm.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createGroup } from '../redux/groupSlice.js';
import InputField from './InputField';
import GroupFormModal from './GroupFormModal';
import { validateGroupForm } from '../utils/validateGroupForm';
import '../assets/Modal.css';

function GroupForm() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    maxMembers: '',
    region: '',
    sport: '',
  });
  const [showModal, setShowModal] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, createdGroup, error } = useSelector((state) => state.group);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateGroupForm(formData);
    if (validationError) {
      alert(validationError);
      return;
    }

    // Redux Thunk dispatch
    const resultAction = await dispatch(createGroup(formData));
    if (createGroup.fulfilled.match(resultAction)) {
      setShowModal(true);
    } else {
      alert(resultAction.payload?.message || '모임 생성 실패');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/');
  };

  return (
    <>
      <form className="group-form" onSubmit={handleSubmit}>
        <h2 className="form-title">모임 모집하기</h2>

        <InputField label="모임 이름" name="name" value={formData.name} onChange={handleChange} />
        <InputField
          label="모임 설명"
          name="description"
          value={formData.description}
          onChange={handleChange}
          type="textarea"
        />
        <InputField label="최대 인원" name="maxMembers" value={formData.maxMembers} onChange={handleChange} type="number" />

        <div className="input-field">
          <label htmlFor="region">지역</label>
          <select id="region" name="region" value={formData.region} onChange={handleChange}>
            <option value="">지역 선택</option>
            <option value="1">강남구</option>
            <option value="2">강동구</option>
            <option value="3">강북구</option>
            <option value="4">강서구</option>
            <option value="5">관악구</option>
            <option value="6">광진구</option>
            <option value="7">구로구</option>
            <option value="8">금천구</option>
            <option value="9">노원구</option>
            <option value="10">도봉구</option>
            <option value="11">동대문구</option>
            <option value="12">동작구</option>
            <option value="13">마포구</option>
            <option value="14">서대문구</option>
            <option value="15">서초구</option>
            <option value="16">성동구</option>
            <option value="17">성북구</option>
            <option value="18">송파구</option>
            <option value="19">양천구</option>
            <option value="20">영등포구</option>
            <option value="21">용산구</option>
            <option value="22">은평구</option>
            <option value="23">종로구</option>
            <option value="24">중구</option>
            <option value="25">중량구</option>
          </select>
        </div>

        <div className="input-field">
          <label htmlFor="sport">종목</label>
          <select id="sport" name="sport" value={formData.sport} onChange={handleChange}>
            <option value="">종목 선택</option>
            <option value="1">농구</option>
            <option value="2">등산</option>
            <option value="3">러닝</option>
            <option value="4">배드민턴</option>
            <option value="5">볼링</option>
            <option value="6">야구</option>
            <option value="7">자전거</option>
            <option value="8">족구</option>
            <option value="9">축구</option>
            <option value="10">탁구</option>
          </select>
        </div>

        <button type="submit" className="submit-btn" disabled={status === 'loading'}>
          {status === 'loading' ? '생성 중...' : '생성하기'}
        </button>
      </form>

      <GroupFormModal show={showModal} onClose={handleCloseModal} message="새로운 모임이 성공적으로 만들어졌습니다.">
        <div
          className="modal-content"
          style={{ padding: '40px 30px', borderRadius: '12px', backgroundColor: '#fff', textAlign: 'center' }}
        >
          <p style={{ fontSize: '18px', marginBottom: '30px' }}>새로운 모임이 성공적으로 만들어졌습니다.</p>
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

      {status === 'failed' && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
    </>
  );
}

export default GroupForm;