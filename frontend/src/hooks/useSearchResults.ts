import { useQuery } from "@tanstack/react-query";
import { fetchSearchResults } from "@/api/search.api";
import { getDistanceFromLatLon } from "@/utils/distanceUtils";
import useMapStore from "@/stores/mapStore";
import type { SearchResultItem } from "@/types/search";

interface SearchParams {
  searchText: string;
  sports: string[];
  leagues: string[];
  bigRegions: string[];
  smallRegions: string[];
  dateFrom: string;
  dateTo: string;
  sort: string;
}

export const useSearchResults = (params: SearchParams, enabled: boolean) => {
  const { position } = useMapStore();

  return useQuery<SearchResultItem[]>({
    queryKey: ["searchResults", params],
    queryFn: async () => {
      const res = await fetchSearchResults({
        search: params.searchText,
        sports: params.sports,
        leagues: params.leagues,
        big_regions: params.bigRegions,
        small_regions: params.smallRegions,
        date_from: params.dateFrom || undefined,
        date_to: params.dateTo || undefined,
        sort: params.sort,
      });

      if (!res.success) return [];

      return res.data.map((item) => {
        if (
          position &&
          typeof position.lat === "number" &&
          typeof position.lng === "number"
        ) {
          const distance = getDistanceFromLatLon(
            position.lat,
            position.lng,
            item.lat,
            item.lng
          );
          return { ...item, distance };
        }
        return { ...item, distance: undefined };
      });
    },
    enabled,
  });
};
