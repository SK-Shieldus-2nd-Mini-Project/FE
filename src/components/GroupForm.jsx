// src/components/GroupForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import InputField from "./InputField";
import GroupFormModal from "./GroupFormModal";
import { validateGroupForm } from "../utils/validateGroupForm";
import { createGroup } from "../redux/groupSlice";
import '../assets/Modal.css';
import '../assets/Group/GroupFormModal.css';

export default function GroupForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    groupName: "",
    description: "",
    maxMembers: "",
    regionId: "",
    sportId: "",
  });

  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [imageFile, setImageFile] = useState(null);
  const { status, error } = useSelector(state => state.group || { status: 'idle', error: null });

  const regionOptions = [
    { id: 1, name: "강남구" },
    { id: 2, name: "강동구" },
    { id: 3, name: "강북구" },
    { id: 4, name: "강서구" },
    { id: 5, name: "관악구" },
    { id: 6, name: "광진구" },
    { id: 7, name: "구로구" },
    { id: 8, name: "금천구" },
    { id: 9, name: "노원구" },
    { id: 10, name: "도봉구" },
    { id: 11, name: "동대문구" },
    { id: 12, name: "동작구" },
    { id: 13, name: "마포구" },
    { id: 14, name: "서대문구" },
    { id: 15, name: "서초구" },
    { id: 16, name: "성동구" },
    { id: 17, name: "성북구" },
    { id: 18, name: "송파구" },
    { id: 19, name: "양천구" },
    { id: 20, name: "영등포구" },
    { id: 21, name: "용산구" },
    { id: 22, name: "은평구" },
    { id: 23, name: "종로구" },
    { id: 24, name: "중구" },
    { id: 25, name: "중량구" },
  ];

  const sportOptions = [
    { id: 1, name: "농구" },
    { id: 2, name: "등산" },
    { id: 3, name: "러닝" },
    { id: 4, name: "배드민턴" },
    { id: 5, name: "볼링" },
    { id: 6, name: "야구" },
    { id: 7, name: "자전거" },
    { id: 8, name: "족구" },
    { id: 9, name: "축구" },
    { id: 10, name: "탁구" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateGroupForm(formData);
    if (validationError) {
      alert(validationError);
      return;
    }

    const formDataToSubmit = new FormData();
    const groupData = {
      groupName: formData.groupName,
      description: formData.description,
      maxMembers: Number(formData.maxMembers),
      regionId: Number(formData.regionId),
      sportId: Number(formData.sportId),
    };

    formDataToSubmit.append('request', new Blob([JSON.stringify(groupData)], { type: "application/json" }));
    if (imageFile) {
      formDataToSubmit.append('image', imageFile);
    }

    try {
      await dispatch(createGroup(formDataToSubmit)).unwrap(); // 수정된 formData 전달
      onSuccess();
    } catch (err) {
      alert(err.message || "모임 생성 실패");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/");
  };

  return (
    <>
      <form className="group-form" onSubmit={handleSubmit}>
        <h2 className="form-title">모임 모집하기</h2>

        <InputField label="모임 이름" name="groupName" value={formData.groupName} onChange={handleChange} />
        <InputField label="모임 설명" name="description" value={formData.description} onChange={handleChange} type="textarea" />
        <InputField label="최대 인원" name="maxMembers" value={formData.maxMembers} onChange={handleChange} type="number" />

        <div className="input-field">
          <label htmlFor="regionId">지역</label>
          <select id="regionId" name="regionId" value={formData.regionId} onChange={handleChange}>
            <option value="">지역 선택</option>
            {regionOptions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>

        <div className="input-field">
          <label htmlFor="sportId">종목</label>
          <select id="sportId" name="sportId" value={formData.sportId} onChange={handleChange}>
            <option value="">종목 선택</option>
            {sportOptions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        <div className="input-field">
          <label htmlFor="image">대표 이미지</label>
          <input type="file" id="image" name="image" accept="image/*" onChange={handleImageChange} />
        </div>

        <button type="submit" className="submit-btn" disabled={status === 'loading'}>
          {status === 'loading' ? "생성 중..." : "생성하기"}
        </button>
        {status === 'failed' && <p style={{ color: "red" }}>{error}</p>}      </form>

      <GroupFormModal show={showModal} onClose={handleCloseModal}>
        <div style={{ padding: '40px 30px', borderRadius: '12px', backgroundColor: '#fff', textAlign: 'center' }}>
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