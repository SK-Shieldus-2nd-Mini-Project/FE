import axios from 'axios';
import { setTokens, logout } from '../redux/authSlice';

const setupAxiosInterceptors = (store) => {
  // 응답 인터셉터 (모든 API 응답을 가로챔)
  axios.interceptors.response.use(
    (response) => response, // 성공 응답은 그대로 통과
    async (error) => {
      const originalRequest = error.config;
      const { dispatch, getState } = store;

      // 401(Unauthorized) 에러이고, 아직 재시도를 안 한 경우에만 실행
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true; // 무한 재시도 방지를 위한 플래그

        const { auth } = getState();
        const refreshToken = auth.refreshToken;

        if (refreshToken) {
          try {
            const response = await axios.post('/api/auth/reissue', {
              accessToken: auth.token,
              refreshToken: auth.refreshToken,
            });

            const { accessToken, refreshToken: newRefreshToken } = response.data;
            
            // Redux 스토어와 로컬 스토리지에 새로운 토큰 저장
            dispatch(setTokens({ accessToken, refreshToken: newRefreshToken }));

            // 실패했던 원래 요청의 헤더에 새 토큰을 넣어 다시 시도
            originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
            return axios(originalRequest);

          } catch (refreshError) {
            // refreshToken마저 만료되면 로그아웃 처리
            console.error('리프레시 토큰이 만료되어 로그아웃합니다.', refreshError);
            dispatch(logout());
            return Promise.reject(refreshError);
          }
        }
      }
      // 401 에러가 아니거나 재시도 요청이면 에러를 그대로 반환
      return Promise.reject(error);
    }
  );
};

export default setupAxiosInterceptors;