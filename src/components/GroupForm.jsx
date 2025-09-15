// src/components/GroupForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import InputField from "./InputField";
import Select from "react-select";
import GroupFormModal from "./modals/GroupFormModal";
import { createGroup } from "../redux/groupSlice";
import '../assets/modals/Modal.css';
import '../assets/modals/GroupFormModal.css';
import { label } from "framer-motion/client";

const customSelectStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    minHeight: '48px',
    boxShadow: 'none',
    '&:hover': {
      borderColor: 'rgba(255, 255, 255, 0.4)',
    },
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: '0 12px',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#ffffff',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: 'rgba(255, 255, 255, 0.6)',
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: 'rgba(30, 30, 30, 0.9)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    backdropFilter: 'blur(5px)',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
    color: '#ffffff',
    padding: '12px 15px',
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: 'rgba(255, 255, 255, 0.6)',
  }),
};

export default function GroupForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    groupName: "",
    description: "",
    maxMembers: "",
    regionId: null,
    sportId: null,
  });

  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [imageFile, setImageFile] = useState(null);
  const { status, error } = useSelector(state => state.group || { status: 'idle', error: null });

  const regionOptions = [
    { value: 1, label: "강남구" },
    { value: 2, label: "강동구" },
    { value: 3, label: "강북구" },
    { value: 4, label: "강서구" },
    { value: 5, label: "관악구" },
    { value: 6, label: "광진구" },
    { value: 7, label: "구로구" },
    { value: 8, label: "금천구" },
    { value: 9, label: "노원구" },
    { value: 10, label: "도봉구" },
    { value: 11, label: "동대문구" },
    { value: 12, label: "동작구" },
    { value: 13, label: "마포구" },
    { value: 14, label: "서대문구" },
    { value: 15, label: "서초구" },
    { value: 16, label: "성동구" },
    { value: 17, label: "성북구" },
    { value: 18, label: "송파구" },
    { value: 19, label: "양천구" },
    { value: 20, label: "영등포구" },
    { value: 21, label: "용산구" },
    { value: 22, label: "은평구" },
    { value: 23, label: "종로구" },
    { value: 24, label: "중구" },
    { value: 25, label: "중량구" },
  ];

  const sportOptions = [
    { value: 1, label: "농구" },
    { value: 2, label: "등산" },
    { value: 3, label: "러닝" },
    { value: 4, label: "배드민턴" },
    { value: 5, label: "볼링" },
    { value: 6, label: "야구" },
    { value: 7, label: "자전거" },
    { value: 8, label: "족구" },
    { value: 9, label: "축구" },
    { value: 10, label: "탁구" },
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

    if (formData.groupName.trim() === "") {
        alert("그룹 이름을 입력해주세요.");
        return;
    }
    if (formData.description.trim() === "") {
        alert("모임 설명을 입력해주세요.");
        return;
    }
    if (formData.maxMembers === "" || Number(formData.maxMembers) <= 0) {
        alert("최대 인원을 올바르게 입력해주세요.");
        return;
    }
    if (!formData.regionId) {
        alert("지역을 선택해주세요.");
        return;
    }
    if (!formData.sportId) {
        alert("종목을 선택해주세요.");
        return;
    }

    const formDataToSubmit = new FormData();
    const groupData = {
      groupName: formData.groupName,
      description: formData.description,
      maxMembers: Number(formData.maxMembers),
      regionId: Number(formData.regionId.value),
      sportId: Number(formData.sportId.value),
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
        <Select
          id="regionId"
          name="regionId"
          options={regionOptions}
          value={formData.regionId}
          onChange={(selectedOption) => setFormData({...formData, regionId: selectedOption})}
          placeholder="지역을 선택하세요..."
          styles={customSelectStyles}
        />
      </div>

        <div className="input-field">
        <label htmlFor="sportId">종목</label>
        <Select
          id="sportId"
          name="sportId"
          options={sportOptions}
          value={formData.sportId}
          onChange={(selectedOption) => setFormData({...formData, sportId: selectedOption})}
          placeholder="종목을 선택하세요..."
          styles={customSelectStyles}
        />
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