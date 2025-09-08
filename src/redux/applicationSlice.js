// src/redux/applicationSlice.js
import { createSlice } from "@reduxjs/toolkit";

const applicationSlice = createSlice({
  name: "applications",
  initialState: {
    myApplications: [] // [{ groupId, groupName, status }]
  },
  reducers: {
    // 모임 참여 신청
    applyToGroup(state, action) {
      const { groupId, groupName } = action.payload;
      state.myApplications.push({
        groupId,
        groupName,
        status: "승인 대기중" // 기본값
      });
    },
    // 신청 상태 업데이트 (관리자/리더가 승인 or 거절)
    updateApplicationStatus(state, action) {
      const { groupId, status } = action.payload;
      const application = state.myApplications.find(app => app.groupId === groupId);
      if (application) {
        application.status = status;
      }
    },
    // 신청 취소
    cancelApplication(state, action) {
      const { groupId } = action.payload;
      state.myApplications = state.myApplications.filter(app => app.groupId !== groupId);
    }
  }
});

export const { applyToGroup, updateApplicationStatus, cancelApplication } = applicationSlice.actions;
export default applicationSlice.reducer;