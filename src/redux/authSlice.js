import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// --- 유틸 함수 ---
const mapUserResponseToState = (userData) => ({
  userId: userData.userId,
  username: userData.username,
  nickname: userData.nickname,
  birthdate: userData.birthdate,
  profileImage: userData.profileImageUrl,
  role: userData.role,
});

// --- Thunks ---

// 회원가입
export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async (userData, { rejectWithValue }) => {
    try {
      const { profileImageFile, ...otherData } = userData;
      const formData = new FormData();
      formData.append('signupRequest', new Blob([JSON.stringify(otherData)], { type: "application/json" }));
      if (profileImageFile) formData.append('file', profileImageFile);

      const response = await axios.post('/api/auth/signup', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: '회원가입 실패' });
    }
  }
);

// 로그인
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (loginData, { rejectWithValue }) => {
    try {
      // 1. 토큰 발급
      const tokenResponse = await axios.post('/api/auth/login', loginData);
      const { accessToken } = tokenResponse.data;

      // 2. Axios 헤더 세팅
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      // 3. 사용자 정보 가져오기
      const userResponse = await axios.get('/api/users/me');
      const mappedUser = mapUserResponseToState(userResponse.data);

      // 4. 토큰과 사용자 정보 반환
      return { token: accessToken, user: mappedUser };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: '로그인 실패' });
    }
  }
);

// 사용자 정보 수정
export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (updateData, { getState, rejectWithValue }) => {
    try {
      const requestData = {
        nickname: updateData.nickname,
        birthdate: updateData.birthdate,
        profileImageUrl: updateData.profileImage,
      };
      if (updateData.newPassword) requestData.password = updateData.newPassword;

      const { token } = getState().auth;
      await axios.put('/api/users/me', requestData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userResponse = await axios.get('/api/users/me');
      return mapUserResponseToState(userResponse.data);
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: '정보 수정 실패' });
    }
  }
);

// 계정 삭제
export const deleteAccountUser = createAsyncThunk(
  'auth/deleteAccountUser',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.delete('/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: '계정 삭제 실패' });
    }
  }
);

// --- 초기 상태 ---
const initialToken = localStorage.getItem('accessToken');

if (initialToken) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${initialToken}`;
}

const initialState = {
  isAuthenticated: !!initialToken,
  user: null,
  token: initialToken,
  status: 'idle',
  error: null,
};

// --- Slice ---
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      axios.defaults.headers.common['Authorization'] = null;
      localStorage.removeItem('accessToken');
    },
    setUser(state, action) {
      state.user = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // 로그인
      .addCase(loginUser.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        localStorage.setItem('accessToken', action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || '로그인 실패';
      })

      // 회원가입
      .addCase(signupUser.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(signupUser.fulfilled, (state) => { state.status = 'succeeded'; })
      .addCase(signupUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || '회원가입 실패';
      })

      // 정보 수정
      .addCase(updateUser.pending, (state) => { state.status = 'loading'; })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || '정보 수정 실패';
      })

      // 계정 삭제
      .addCase(deleteAccountUser.pending, (state) => { state.status = 'loading'; })
      .addCase(deleteAccountUser.fulfilled, (state) => {
        state.status = 'idle';
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        axios.defaults.headers.common['Authorization'] = null;
        localStorage.removeItem('accessToken');
      })
      .addCase(deleteAccountUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || '계정 삭제 실패';
      });
  }
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;