import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyInfo, updateNickname } from "@/api/user.api";
import useToastStore from "@/stores/toastStore";

export const useUserInfo = () => {
  return useQuery({
    queryKey: ["myInfo"],
    queryFn: getMyInfo,
  });
};

export const useUpdateNickname = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  return useMutation({
    mutationFn: (nickname: string) => updateNickname(nickname),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myInfo"] });
      addToast("닉네임이 변경되었습니다", "success");
    },
    onError: () => {
      addToast("닉네임 변경에 실패했습니다", "error");
    },
  });
};