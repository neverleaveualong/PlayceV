import httpClient from "./http";
import type { UserInfoResponse } from "@/types/user";

export const getMyInfo = async (): Promise<UserInfoResponse> => {
  const res = await httpClient.get("/users/me");
  return res.data;
};

export const updateNickname = async (nickname: string) => {
  const res = await httpClient.patch("/users/nickname", { nickname });
  return res.data;
};