import "reflect-metadata";
import { AppDataSource } from "../src/data-source";

import { seedBusinessNumbers } from "./businessNumberSeeder";
import { seedRegions } from "./regionSeeder";
import { seedSportLeagues } from "./sportLeagueSeeder";

import { seedUsers } from "./userSeeder";
import { seedStores } from "./storeSeeder";
import { seedBroadcasts } from "./broadcastSeeder";
import { seedFavorites } from "./favoriteSeeder";

const resetDB = async () => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();

  try {
    await queryRunner.startTransaction();

    await queryRunner.query(`SET FOREIGN_KEY_CHECKS = 0;`);

    await queryRunner.query(`TRUNCATE TABLE stores_images`);
    await queryRunner.query(`TRUNCATE TABLE favorites`);
    await queryRunner.query(`TRUNCATE TABLE broadcasts`);
    await queryRunner.query(`TRUNCATE TABLE stores`);
    await queryRunner.query(`TRUNCATE TABLE users`);

    await queryRunner.query(`TRUNCATE TABLE business_numbers`);
    await queryRunner.query(`TRUNCATE TABLE small_regions`);
    await queryRunner.query(`TRUNCATE TABLE big_regions`);
    await queryRunner.query(`TRUNCATE TABLE leagues`);
    await queryRunner.query(`TRUNCATE TABLE sports`);

    await queryRunner.query(`SET FOREIGN_KEY_CHECKS = 1;`);

    await queryRunner.commitTransaction();
    console.log('📦 DB 초기화 완료');
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error("❌ DB 초기화 실패", error);
    throw error;
  } finally {
    await queryRunner.release();
  }
};

const runSeeders = async () => {
  try {
    await seedBusinessNumbers();
    await seedRegions();
    await seedSportLeagues();

    await seedUsers();
    await seedStores();
    await seedBroadcasts();
    await seedFavorites();

    console.log("🌱 Seed 완료");
  } catch (error) {
    console.error("❌ Seed 오류: ", error);
  }
};

if (require.main === module) {
  (async () => {
    try {
      await AppDataSource.initialize(); // 데이터베이스 연결 초기화
      await resetDB(); // DB 초기화
      await runSeeders(); // 시드 삽입
    } catch (error) {
      console.error("❌ 초기화 및 시드 삽입 실패", error);
      process.exit(1);
    } finally {
      await AppDataSource.destroy();
      process.exit(0);
    }
  })();
}