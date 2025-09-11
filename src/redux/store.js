import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import groupReducer from "./groupSlice";
import applicationReducer from "./applicationSlice";

// 1. 로컬 스토리지에서 상태를 불러오는 함수
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('state');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

// 2. 상태를 로컬 스토리지에 저장하는 함수
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
  } catch {
    // 저장 에러 처리
  }
};

// 3. 저장된 상태를 preloadedState로 사용하여 스토어 생성
const persistedState = loadState();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    group: groupReducer,
    applications: applicationReducer,
  },
  preloadedState: persistedState, // 여기를 수정해주세요.
});

// 4. 스토어의 상태가 변경될 때마다 로컬 스토리지에 저장
store.subscribe(() => {
  saveState({
    auth: store.getState().auth,
    group: store.getState().group,
    applications: store.getState().applications,
  });
});