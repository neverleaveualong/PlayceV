import { Request, Response, NextFunction } from "express";
import broadcastService from "../service/broadcastService";
import { AuthRequest } from "../middlewares/authMiddleware";
import { success } from "../utils/response";
import { logApiError } from "../utils/errorUtils";
import { log } from "../utils/logUtils";

const createBroadcast = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    log("\n🚀 [중계 일정 등록] 요청");
    const userId = req.user!.userId;
    const newBroadcast = await broadcastService.createBroadcast(req.body, userId);

    log("✅ [중계 일정 등록] 성공");
    return success(res, "중계 일정이 등록되었습니다.", { broadcast_id: newBroadcast.id }, 201);
  } catch (error) {
    logApiError("중계 일정 등록", error);
    next(error);
  }
};

const deleteBroadcast = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    log("\n🚀 [중계 일정 삭제] 요청");

    const userId = req.user!.userId;
    const broadcasts_id = req.params.broadcasts_id as string;
    await broadcastService.deleteBroadcast(Number(broadcasts_id), userId);

    log("✅ [중계 일정 삭제] 성공");
    return success(res, "중계 일정이 삭제되었습니다.");
  } catch (error) {
    logApiError("중계 일정 등록", error);
    next(error);
  }
};

const updateBroadcast = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    log("\n🚀 [중계 일정 수정] 요청");

    const userId = req.user!.userId;
    const broadcasts_id = req.params.broadcasts_id as string;
    await broadcastService.updateBroadcast(Number(broadcasts_id), req.body, userId);

    log("✅ [중계 일정 수정] 성공");
    return success(res, "중계 일정이 수정되었습니다.");
  } catch (error) {
    logApiError("중계 일정 수정", error);
    next(error);
  }
};

const getBroadcastsByStore = async (req: Request, res: Response, next: NextFunction) => {
  try {
    log("\n🚀 [중계 일정 조회] 요청");

    const store_id = req.params.store_id as string;
    const broadcasts = await broadcastService.getBroadcastsByStore(Number(store_id));

    log("✅ [중계 일정 조회] 성공");
    return success(res, "중계 일정 조회 성공", broadcasts);
  } catch (error) {
    logApiError("중계 일정 조회", error);
    next(error);
  }
}; 

export default {
  createBroadcast,
  deleteBroadcast,
  updateBroadcast,
  getBroadcastsByStore,
};
