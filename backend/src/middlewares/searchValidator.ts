import { query } from "express-validator";
import validate from "./validate";

export const NearbySearchValidator = [
  query("swLat")
    .notEmpty().withMessage("남서 위도(swLat)를 입력해주세요.").bail()
    .isFloat({ min: -90, max: 90 })
    .withMessage("남서 위도는 -90 ~ 90 사이여야 합니다."),

  query("swLng")
    .notEmpty().withMessage("남서 경도(swLng)를 입력해주세요.").bail()
    .isFloat({ min: -180, max: 180 })
    .withMessage("남서 경도는 -180 ~ 180 사이여야 합니다."),

  query("neLat")
    .notEmpty().withMessage("북동 위도(neLat)를 입력해주세요.").bail()
    .isFloat({ min: -90, max: 90 })
    .withMessage("북동 위도는 -90 ~ 90 사이여야 합니다."),

  query("neLng")
    .notEmpty().withMessage("북동 경도(neLng)를 입력해주세요.").bail()
    .isFloat({ min: -180, max: 180 })
    .withMessage("북동 경도는 -180 ~ 180 사이여야 합니다."),

  validate,
];
