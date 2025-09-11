// src/redux/groupSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// --- 모임 생성 Thunk ---
export const createGroup = createAsyncThunk(
  'group/createGroup',
  async (formData, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth; // JWT 토큰 가져오기

      const payload = {
        groupName: formData.groupName,
        regionId: Number(formData.regionId),
        sportId: Number(formData.sportId),
        description: formData.description,
        maxMembers: Number(formData.maxMembers),
      };

      const response = await axios.post('/api/groups', payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.data; // 서버 응답 반환
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: '모임 생성 실패' });
    }
  }
);

// --- 전체 그룹 조회 Thunk ---
export const fetchAllGroups = createAsyncThunk(
  'group/fetchAllGroups',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;

      const response = await axios.get('/api/groups', {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: '그룹 조회 실패' });
    }
  }
);

export const joinGroup = createAsyncThunk(
  'group/joinGroup',
  async (groupId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      await axios.post(`/api/groups/${groupId}/join`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return groupId;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: '모임 가입 신청 실패' });
    }
  }
);

// --- Slice ---
const groupSlice = createSlice({
  name: 'group',
  initialState: {
    status: 'idle',       // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    createdGroup: null,   // 새로 생성된 그룹
    groups: [],           // 전체 그룹 리스트
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // --- createGroup 처리 ---
      .addCase(createGroup.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.createdGroup = action.payload;
      })
      .addCase(createGroup.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message || '모임 생성 실패';
      })

      // --- fetchAllGroups 처리 ---
      .addCase(fetchAllGroups.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAllGroups.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.groups = action.payload;
      })
      .addCase(fetchAllGroups.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message || '그룹 조회 실패';
      })
      .addCase(joinGroup.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(joinGroup.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(joinGroup.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message || '가입 신청 처리 중 오류가 발생했습니다.';
      })
  },
});

export default groupSlice.reducer;