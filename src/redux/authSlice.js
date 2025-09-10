import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const mapUserResponseToState = (userData) => {
  return {
    userId: userData.userId,
    username: userData.username,
    nickname: userData.nickname,
    birthdate: userData.birthdate,
    profileImage: userData.profileImageUrl,
    role: userData.role,
  };
};

// --- Thunk Actions ---

// 1. 회원가입 Thunk
export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async (userData, { rejectWithValue }) => {
    try {
      const { profileImageFile, ...otherData } = userData;
      const formData = new FormData();

      // 1. JSON 데이터를 Blob으로 변환하여 추가
      formData.append('signupRequest', new Blob([JSON.stringify(otherData)], { type: "application/json" }));

      // 2. 이미지 파일이 있으면 추가
      if (profileImageFile) {
        formData.append('file', profileImageFile);
      }

      const response = await axios.post('/api/auth/signup', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// 2. 로그인 Thunk
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (loginData, { rejectWithValue }) => {
    try {
      // 2-1. 로그인 요청으로 토큰 받기
      const tokenResponse = await axios.post('/api/auth/login', loginData);
      const { accessToken } = tokenResponse.data;

      // 2-2. 받은 토큰을 헤더에 설정
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      // 2-3. 사용자 정보 요청
      const userResponse = await axios.get('/api/users/me');

      // ===============================
      console.log("Raw User Response:", userResponse.data); // 디버깅용 로그
      // ===============================

      const mappedUser = mapUserResponseToState(userResponse.data);
      // 2-4. 토큰과 사용자 정보를 함께 반환
      return { token: accessToken, user: mappedUser };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteAccountUser = createAsyncThunk(
  'auth/deleteAccountUser',
  async (_, { getState, rejectWithValue }) => {
    try {
      // 현재 상태에서 토큰을 가져와 헤더에 추가
      const { token } = getState().auth;
      const response = await axios.delete('/api/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (updateData, { getState, rejectWithValue }) => {
    try {
      // DTO에 맞는 데이터만 추출 (password는 새 비밀번호가 있을 때만 포함)
      const requestData = {
        nickname: updateData.nickname,
        birthdate: updateData.birthdate,
        profileImageUrl: updateData.profileImage,
      };
      if (updateData.newPassword) {
        requestData.password = updateData.newPassword;
      }

      const { token } = getState().auth;
      // PUT /api/users/me 엔드포인트로 수정 요청
      await axios.put('/api/users/me', requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userResponse = await axios.get('/api/users/me');
      return mapUserResponseToState(userResponse.data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      axios.defaults.headers.common['Authorization'] = null;
      // 로컬 스토리지도 정리
      localStorage.removeItem('state');
    },
  },
  // 3. extraReducers로 비동기 액션 상태 처리
  extraReducers: (builder) => {
    builder
      // 로그인 액션
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message || '로그인에 실패했습니다.';
      })
      // 회원가입 액션 (회원가입은 상태를 바꾸지 않음)
      .addCase(signupUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message || '회원가입에 실패했습니다.';
      })
      .addCase(deleteAccountUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteAccountUser.fulfilled, (state) => {
        // 성공 시, 로그아웃 처리와 동일하게 상태 초기화
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.status = 'idle';
        axios.defaults.headers.common['Authorization'] = null;
        localStorage.removeItem('state');
      })
      .addCase(deleteAccountUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message || '계정 삭제에 실패했습니다.';
      })
      .addCase(updateUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload; 
            })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message || '정보 수정에 실패했습니다.';
      })
  },

});

export const { logout } = authSlice.actions;
export default authSlice.reducer;