export interface Broadcast {
  match_date: string;
  match_time: string;
  sport: string;
  league: string;
  team_one: string;
  team_two: string;
  etc: string;
}

export interface BroadcastWithId extends Broadcast {
  broadcast_id: number;
}
