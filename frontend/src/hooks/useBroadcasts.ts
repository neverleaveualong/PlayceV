import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBroadcast, deleteBroadcast } from "@/api/broadcast.api";
import type { BroadcastWithId } from "@/types/broadcast";

const useBroadcasts = (storeId: number) => {
  return useQuery<BroadcastWithId[]>({
    queryKey: ["broadcasts", storeId],
    queryFn: async () => {
      const broadcasts = await getBroadcast(storeId);
      return broadcasts;
    },
    enabled: storeId > 0,
  });
};

export const useDeleteBroadcast = (storeId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (broadcastId: number) => deleteBroadcast(broadcastId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["broadcasts", storeId] });
    },
  });
};

export default useBroadcasts;
