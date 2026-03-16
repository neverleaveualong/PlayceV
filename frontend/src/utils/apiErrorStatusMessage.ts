import axios, { type AxiosError } from "axios";

interface ApiErrorResponse {
  message?: string;
}

export const getApiErrorMessage = (error: unknown): string => {
  if (!axios.isAxiosError(error)) {
    return "오류가 발생하였습니다";
  }
  const axiosError = error as AxiosError<ApiErrorResponse>;
  if (axiosError.response?.data?.message) {
    return axiosError.response.data.message;
  }
  if (axiosError.code === "ECONNABORTED") {
    return "서버 응답 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.";
  }
  if (!axiosError.response) {
    return "서버에 연결할 수 없습니다. 네트워크를 확인해주세요.";
  }
  return "오류가 발생하였습니다";
};
