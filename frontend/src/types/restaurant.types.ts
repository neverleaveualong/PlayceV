import type { Broadcast, BroadcastWithId } from "./broadcast";

export type { Broadcast, BroadcastWithId };

export type RestaurantBasic = {
  store_id: number;
  store_name: string;
  type: string;
  main_img: string;
  address: string;
  lat: number;
  lng: number;
  broadcasts: Broadcast[];
};

export interface RestaurantDetail {
  id: number;
  store_name: string;
  address: string;
  phone: string;
  opening_hours: string;
  menus: MenuItem[];
  type: string;
  img_urls: string[];
  description: string;
  broadcasts: BroadcastWithId[];
  is_owner?: boolean;
  lat: number;
  lng: number;
}

export interface MyStore {
  store_id: number;
  store_name: string;
  main_img: string;
  address: string;
}

export type MenuItem = {
  name: string;
  price: string;
};
