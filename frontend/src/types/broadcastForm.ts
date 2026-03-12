export interface CreateBroadcastPayload {
  store_id: number;
  match_date: string;
  match_time: string;
  sport_id: number;
  league_id: number;
  team_one?: string;
  team_two?: string;
  etc?: string;
}

export interface BroadcastRegisterEditProps {
  mode: "create" | "edit";
  broadcastId?: number;
  onClose: () => void;
  storeId: number;
}