import { AppDataSource } from "../data-source";
import { Favorite } from "../entities/Favorite";
import { Store } from "../entities/Store";
import { Broadcast } from "../entities/Broadcast";
import { createError } from "../utils/errorUtils";
import { formatDateToKST } from "../utils/dateFormatter";
import { log } from "../utils/logUtils";
import { getCache, setCache, deleteCache } from "../utils/redis";

const favoriteRepository = AppDataSource.getRepository(Favorite);
const storeRepository = AppDataSource.getRepository(Store);

const favoriteService = {
  addFavorite: async (userId: number, storeId: number) => {
    log("[Service]즐겨찾기 추가 - userId:", userId, "storeId:", storeId);

    const store = await storeRepository.findOneBy({ id: storeId });
    if (!store) throw createError("해당 식당을 찾을 수 없습니다.", 404);
    log("식당 확인 완료:", store.storeName);

    const existing = await favoriteRepository.findOne({
      where: {
        user: { id: userId },
        store: { id: storeId },
      },
      relations: ["user", "store"],
    });

    if (existing) throw createError("이미 즐겨찾기에 추가된 식당입니다.", 409);

    const newFavorite = favoriteRepository.create({
      user: { id: userId },
      store,
    });
    const saved = await favoriteRepository.save(newFavorite);

    const cacheKey = `favorites:user:${userId}`;
    await deleteCache(cacheKey);
    log("Redis 캐시 무효화 완료:", cacheKey);

    log("즐겨찾기 저장 완료 - ID:", saved.id);
    return {
      favorite_id: saved.id,
      store_id: store.id,
      created_at: formatDateToKST(new Date(saved.createdAt)),
    };
  },

  removeFavorite: async (userId: number, storeId: number) => {
    log("[Service]즐겨찾기 삭제 - userId:", userId, "storeId:", storeId);

    const favorite = await favoriteRepository.findOne({
      where: {
        user: { id: userId },
        store: { id: storeId },
      },
      relations: ["user", "store"],
    });

    if (!favorite) {
      throw createError("해당 즐겨찾기 항목이 존재하지 않습니다.", 404);
    }

    await favoriteRepository.remove(favorite);

    const cacheKey = `favorites:user:${userId}`;
    await deleteCache(cacheKey); 
    log("Redis 캐시 무효화 완료:", cacheKey);

    log("즐겨찾기 삭제 완료");
  },

  getFavorites: async (userId: number) => {
    log("[Service]즐겨찾기 목록 조회 - userId:", userId);

    const cacheKey = `favorites:user:${userId}`;
    const cached = await getCache(cacheKey);
    if (cached) {
      log("✅ Redis 캐시 사용:", cacheKey);
      return cached;
    }

    const favorites = await favoriteRepository.find({
      where: { user: { id: userId } },
      relations: ["store", "store.images"],
      order: { createdAt: "ASC" },
    });

    log("즐겨찾기 개수:", favorites.length);

    const result = favorites.map((fav) => {
      const images = fav.store.images || [];
      const mainImage = images.find((img) => img.isMain);

      return {
        store_id: fav.store.id,
        store_name: fav.store.storeName,
        main_img: mainImage?.imgUrl || null,
        address: fav.store.address,
        type: fav.store.type,
        created_at: formatDateToKST(fav.createdAt),
      };
    });

    await setCache(cacheKey, result);
    log("📝 Redis 캐시 저장 완료:", cacheKey);

    return result;
  },
  getUpcomingBroadcasts: async (userId: number) => {
    log("[Service]즐겨찾기 다가오는 중계 조회 - userId:", userId);

    const cacheKey = `favorites:upcoming:${userId}`;
    const cached = await getCache(cacheKey);
    if (cached) {
      log("✅ Redis 캐시 사용:", cacheKey);
      return cached;
    }

    const today = new Date().toISOString().slice(0, 10);

    const broadcastRepo = AppDataSource.getRepository(Broadcast);
    const broadcasts = await broadcastRepo
      .createQueryBuilder("broadcast")
      .innerJoin("broadcast.store", "store")
      .innerJoin("favorites", "fav", "fav.store_id = store.id AND fav.user_id = :userId", { userId })
      .leftJoinAndSelect("broadcast.sport", "sport")
      .leftJoinAndSelect("broadcast.league", "league")
      .leftJoin("store.images", "image", "image.isMain = true")
      .addSelect(["store.id", "store.storeName", "store.address", "store.type", "store.lat", "store.lng"])
      .addSelect("image.imgUrl", "main_img")
      .where("broadcast.matchDate >= :today", { today })
      .orderBy("broadcast.matchDate", "ASC")
      .addOrderBy("broadcast.matchTime", "ASC")
      .limit(20)
      .getMany();

    // store 관계를 포함하여 다시 조회
    const broadcastIds = broadcasts.map((b) => b.id);
    if (broadcastIds.length === 0) {
      await setCache(cacheKey, [], 60);
      return [];
    }

    const fullBroadcasts = await broadcastRepo
      .createQueryBuilder("broadcast")
      .leftJoinAndSelect("broadcast.store", "store")
      .leftJoinAndSelect("store.images", "image", "image.isMain = true")
      .leftJoinAndSelect("broadcast.sport", "sport")
      .leftJoinAndSelect("broadcast.league", "league")
      .where("broadcast.id IN (:...ids)", { ids: broadcastIds })
      .orderBy("broadcast.matchDate", "ASC")
      .addOrderBy("broadcast.matchTime", "ASC")
      .getMany();

    const result = fullBroadcasts.map((b) => ({
      broadcast_id: b.id,
      match_date: b.matchDate,
      match_time: b.matchTime?.slice(0, 5),
      sport: b.sport.name,
      league: b.league.name,
      team_one: b.teamOne,
      team_two: b.teamTwo,
      etc: b.etc,
      store: {
        store_id: b.store.id,
        store_name: b.store.storeName,
        address: b.store.address,
        type: b.store.type,
        main_img: b.store.images?.[0]?.imgUrl ?? null,
        lat: b.store.lat,
        lng: b.store.lng,
      },
    }));

    await setCache(cacheKey, result, 60);
    log("📝 Redis 캐시 저장 완료:", cacheKey);
    return result;
  },
};

export default favoriteService;