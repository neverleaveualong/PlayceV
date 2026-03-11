import type { AxiosError } from "axios";

interface ApiErrorResponse {
  message?: string;
}

export const getApiErrorMessage = (error: unknown): string => {
  const axiosError = error as AxiosError<ApiErrorResponse>;
  return (
    axiosError.response?.data?.message || "오류가 발생하였습니다"
  );
};
