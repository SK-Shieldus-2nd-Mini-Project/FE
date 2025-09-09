import { createSlice } from '@reduxjs/toolkit';

// 테스트용 사용자 계정 데이터베이스 (추가 정보 포함)
const initialUsers = {
  'user123': { 
    password: 'password123', 
    nickname: '운동매니아', 
    role: 'leader', 
    hasCreatedGroup: true,
    birthdate: '1995-05-15',
    profileImage: '/public/mymelody.png' 
  },
  'admin': { 
    password: 'admin', 
    nickname: '관리자', 
    role: 'admin', 
    hasCreatedGroup: false,
    birthdate: '1990-01-01',
    profileImage: null
  },
};

const initialState = {
  isAuthenticated: false,
  user: null,
  users: initialUsers,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      try {
        const state = JSON.parse(localStorage.getItem('state'));
        state.auth = initialState;
        localStorage.setItem('state', JSON.stringify(state));
      } catch (err) {
        // 에러 처리
      }
    },
    signup(state, action) {
        const { username, password, nickname, birthdate, profileImage } = action.payload;
        if (!state.users[username]) {
            state.users[username] = { 
                password, 
                nickname, 
                birthdate,
                profileImage, // 이미지 경로 저장
                role: 'user', 
                hasCreatedGroup: false 
            };
        }
    },
    // 사용자 정보 업데이트를 위한 액션 추가
    updateUser(state, action) {
        const { username, nickname, birthdate, profileImage } = action.payload;
        if (state.user && state.user.username === username) {
            // 현재 로그인된 사용자의 정보 업데이트
            state.user.nickname = nickname;
            state.user.birthdate = birthdate;
            state.user.profileImage = profileImage;

            // 전체 사용자 목록에서도 업데이트
            state.users[username].nickname = nickname;
            state.users[username].birthdate = birthdate;
            state.users[username].profileImage = profileImage;
        }
    },

    deleteAccount(state, action) {
      const { username } = action.payload;
      if (state.users[username]) {
        delete state.users[username]; // 사용자 목록에서 해당 유저 삭제
      }
      // 로그아웃 처리
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    }
  },
});

export const { loginSuccess, logout, signup, updateUser, deleteAccount } = authSlice.actions;
export default authSlice.reducer;