import { AppDataSource } from "../data-source";
import { Store } from "../entities/Store";
import { Broadcast } from "../entities/Broadcast";
import { SmallRegion } from "../entities/SmallRegion";
import { Sport } from "../entities/Sport";
import { League } from "../entities/League";
import { Brackets } from "typeorm";
import { getCache, setCache } from "../utils/redis";
import crypto from "crypto";
import { log } from "../utils/logUtils";

const searchService = {
  // 화면 영역(bounds) 기반 검색
  getNearbyStores: async (swLat: number, swLng: number, neLat: number, neLng: number, date?: string) => {
    const storeRepo = AppDataSource.getRepository(Store);

    const query = storeRepo
      .createQueryBuilder("store")
      .leftJoinAndSelect("store.images", "image", "image.isMain = true")
      .leftJoinAndSelect("store.broadcasts", "broadcast")
      .leftJoinAndSelect("broadcast.sport", "sport")
      .leftJoinAndSelect("broadcast.league", "league")
      .where("store.lat BETWEEN :swLat AND :neLat", { swLat, neLat })
      .andWhere("store.lng BETWEEN :swLng AND :neLng", { swLng, neLng });

    if (date) {
      query.andWhere("broadcast.matchDate = :date", { date });
    }

    const stores = await query.getMany();

    return stores.map((store) => ({
      store_id: store.id,
      store_name: store.storeName,
      type: store.type,
      main_img: store.images[0]?.imgUrl ?? null,
      address: store.address,
      opening_hours: store.openingHours,
      lat: store.lat,
      lng: store.lng,
      broadcasts: store.broadcasts.map((b) => ({
        match_date: b.matchDate,
        match_time: b.matchTime.slice(0, 5),
        sport: b.sport.name,
        league: b.league.name,
        team_one: b.teamOne,
        team_two: b.teamTwo,
        etc: b.etc,
      })),
    }));
  },

  // 통합 검색
  searchStores: async (filters: {
    search?: string;
    sports?: string[];
    leagues?: string[];
    team?: string;
    big_regions?: string[];
    small_regions?: string[];
    date_from?: string;
    date_to?: string;
    sort?: "date" | "name" | "distance";
  }) => {
    //  캐시 키 생성
    const filtersHash = crypto
      .createHash("md5")
      .update(JSON.stringify(filters))
      .digest("hex");
    const cacheKey = `search:filters:${filtersHash}`;

    const cached = await getCache(cacheKey);
    if (cached) {
      log(`[Redis Cache] Cache hit for key: ${cacheKey}`);
      return cached;
    }

    const {
      search,
      sports = [],
      leagues = [],
      team,
      big_regions = [],
      small_regions = [],
      date_from,
      date_to,
      sort,
    } = filters;

    const storeRepo = AppDataSource.getRepository(Store);
    const smallRegionRepo = AppDataSource.getRepository(SmallRegion);
    const sportRepo = AppDataSource.getRepository(Sport);
    const leagueRepo = AppDataSource.getRepository(League);

    const query = storeRepo
      .createQueryBuilder("store")
      .leftJoinAndSelect("store.images", "image", "image.isMain = true")
      .leftJoinAndSelect("store.broadcasts", "broadcast")
      .leftJoinAndSelect("broadcast.sport", "sport")
      .leftJoinAndSelect("broadcast.league", "league")
      .leftJoinAndSelect("store.bigRegion", "bigRegion")
      .leftJoinAndSelect("store.smallRegion", "smallRegion");

    if (search) {
      query.andWhere(
        new Brackets(qb => {
          qb.where("store.storeName LIKE :search", { search: `%${search}%` })
            .orWhere("store.address LIKE :search", { search: `%${search}%` })
            .orWhere("broadcast.teamOne LIKE :search", { search: `%${search}%` })
            .orWhere("broadcast.teamTwo LIKE :search", { search: `%${search}%` });
        })
      );
    }


    // 날짜 필터
    if (date_from) {
      query.andWhere("broadcast.matchDate >= :date_from", { date_from });
    }
    if (date_to) {
      query.andWhere("broadcast.matchDate <= :date_to", { date_to });
    }

    if (leagues.length > 0 && !leagues.includes("전체") && !leagues.includes("all")) {
      // 특정 리그가 선택된 경우 → 리그로 필터 (KBO만 선택하면 KBO만)
      query.andWhere("league.name IN (:...leagues)", { leagues });
    } else if (sports.length > 0) {
      // 종목만 선택하고 리그는 미선택 → 해당 종목 전체
      query.andWhere("sport.name IN (:...sports)", { sports });
    }

    if (small_regions.length > 0) {
      const matchedSmallRegions = await smallRegionRepo
        .createQueryBuilder("smallRegion")
        .leftJoinAndSelect("smallRegion.bigRegion", "bigRegion")
        .where("smallRegion.name IN (:...smallRegions)", { smallRegions: small_regions })
        .getMany();

      const bigRegionsFromSmall = Array.from(
        new Set(matchedSmallRegions.map(sr => sr.bigRegion.name))
      );

      query.andWhere(
        new Brackets(qb => {
          qb.where("smallRegion.name IN (:...smallRegions)", { smallRegions: small_regions });

          if (big_regions.length > 0) {
            const bigRegionsExtra = big_regions.filter(br => !bigRegionsFromSmall.includes(br));
            if (bigRegionsExtra.length > 0) {
              qb.orWhere("bigRegion.name IN (:...bigRegionsExtra)", { bigRegionsExtra });
            }
          }
        })
      );
    } else if (big_regions.length > 0) {
      query.andWhere("bigRegion.name IN (:...bigRegions)", { bigRegions: big_regions });
    }

    if (sort === "name") {
      query.orderBy("store.storeName", "ASC");
    } else if (sort === "date") {
      query.orderBy("broadcast.matchDate", "ASC");
    }

    const stores = await query.getMany();

    const response = stores.map((store) => {
      const latestBroadcast = store.broadcasts
        .slice()
        .sort((a, b) => {
          const aDate = new Date(`${a.matchDate}T${a.matchTime}`);
          const bDate = new Date(`${b.matchDate}T${b.matchTime}`);
          return bDate.getTime() - aDate.getTime();
        })[0];

      return {
        id: store.id,
        store_name: store.storeName,
        img_url: store.images[0]?.imgUrl ?? null,
        address: store.address,
        lat: store.lat,
        lng: store.lng,
        broadcast: latestBroadcast
          ? {
            id: latestBroadcast.id,
            match_date: latestBroadcast.matchDate,
            match_time: latestBroadcast.matchTime?.slice(0, 5),
            sport: latestBroadcast.sport?.name,
            league: latestBroadcast.league?.name,
            team_one: latestBroadcast.teamOne,
            team_two: latestBroadcast.teamTwo,
            etc: latestBroadcast.etc,
          }
          : null,
      };
    });

    await setCache(cacheKey, response); // TTL 기본값 사용
    log(`[Redis Cache] Cache set for key: ${cacheKey}`);
    return response;
  },
};

export default searchService;