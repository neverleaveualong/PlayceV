import { requestHandler } from "./http";
import type { Bounds } from "@/types/map";

export const searchNearby = (data: Bounds) => {
  return requestHandler("get", "/search/nearby", data);
};
