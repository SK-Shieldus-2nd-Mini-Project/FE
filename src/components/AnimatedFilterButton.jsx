import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../assets/AnimatedFilterButton.css';

// 옵션 리스트 컨테이너의 애니메이션 Variants
const optionsListVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring', // 젤리같은 효과를 위한 spring 타입
      stiffness: 300,
      damping: 20,
      staggerChildren: 0.05, // 옵션 아이템들이 순차적으로 나타남
    },
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.95,
    transition: {
      duration: 0.2,
    },
  },
};

// 각 옵션 아이템의 애니메이션 Variants
const optionItemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export default function AnimatedFilterButton({ buttonText, options, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const filterRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsOpen(false); // ref의 바깥을 클릭하면 팝업을 닫음
      }
    }
    // 이벤트 리스너 등록
    document.addEventListener("mousedown", handleClickOutside);
    // 컴포넌트가 언마운트될 때 이벤트 리스너 해제
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filterRef]); // ref가 변경될 때마다 이펙트 재실행

  const handleSelect = (option) => {
    setSelected(option);
    onSelect(option); // 부모 컴포넌트로 선택된 값 전달
    setIsOpen(false); // 옵션 선택 후 닫기
  };

  return (
    <div className="filter-button-container" ref={filterRef}>
      <button className="filter-button" onClick={() => setIsOpen(!isOpen)}>
        {selected || buttonText}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            className="options-list"
            variants={optionsListVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* 전체 선택 옵션 */}
            <motion.li
                className="option-item"
                variants={optionItemVariants}
                onClick={() => handleSelect('전체')}
            >
                전체
            </motion.li>
            {options.map((option, index) => (
              <motion.li
                key={index}
                className="option-item"
                variants={optionItemVariants}
                onClick={() => handleSelect(option)}
              >
                {option}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}