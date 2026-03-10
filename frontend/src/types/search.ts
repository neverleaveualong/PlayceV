import type { Broadcast } from "./broadcast";

export type { Broadcast };

export interface SearchResultItem {
  id: number;
  store_name: string;
  img_url: string;
  address: string;
  lat: number;
  lng: number;
  distance?: number;
  broadcast: Broadcast;
}
