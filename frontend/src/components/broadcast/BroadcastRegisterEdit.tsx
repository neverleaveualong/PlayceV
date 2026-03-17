import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { DatePicker, TimePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { createBroadcast, editBroadcast } from "@/api/broadcast.api";
import useBroadcastStore from "@/stores/broadcastStore";
import useToastStore from "@/stores/toastStore";
import SelectInput from "@/components/common/SelectInput";
import type { BroadcastRegisterEditProps } from "@/types/broadcastForm";
import useMypageStore from "@/stores/mypageStore";
import Button from "@/components/common/Button";
import useBroadcasts from "@/hooks/useBroadcasts";
import { useSports } from "@/hooks/useSports";
import { useLeagues } from "@/hooks/useLeagues";
import { useQueryClient } from "@tanstack/react-query";

// ① 폼 값 타입 정의
interface BroadcastFormValues {
  date: Dayjs | null;
  time: Dayjs | null;
  sportId: number | null;
  leagueId: number | null;
  team1: string;
  team2: string;
  note: string;
}

const BroadcastRegisterEdit = (props: BroadcastRegisterEditProps) => {
  const storeId = useBroadcastStore((state) => state.storeId);
  const { data: broadcastLists = [] } = useBroadcasts(storeId);
  const queryClient = useQueryClient();
  const setRestaurantSubpage = useMypageStore((state) => state.setRestaurantSubpage);
  const [isTeamCompetition, setIsTeamCompetition] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addToast = useToastStore((state) => state.addToast);

  // ② useForm — broadcastFormStore를 대체
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
  } = useForm<BroadcastFormValues>({
    defaultValues: {
      date: null,
      time: null,
      sportId: null,
      leagueId: null,
      team1: "",
      team2: "",
      note: "",
    },
  });

  // ③ watch — sportId 값을 실시간 감시 (종목↔리그 연동)
  const sportId = watch("sportId");

  // ④ React Query 훅 — fetchSports/fetchLeagues 직접 호출 제거
  const { data: sports = [] } = useSports();
  const { data: leagues = [] } = useLeagues(sportId ?? undefined);

  // ⑤ 등록 모드 진입 시 폼 초기화
  useEffect(() => {
    if (props.mode === "create") {
      reset({
        date: null,
        time: null,
        sportId: null,
        leagueId: null,
        team1: "",
        team2: "",
        note: "",
      });
      setIsTeamCompetition(true);
    }
  }, [props.mode, reset]);

  // ⑥ 수정 모드 진입 시 기존 데이터로 폼 채우기
  useEffect(() => {
    if (props.mode !== "edit" || props.broadcastId == null) return;

    const target = broadcastLists.find(
      (b) => b.broadcast_id === props.broadcastId
    );
    if (!target) {
      addToast("수정할 중계 정보를 찾을 수 없습니다.", "error");
      return;
    }

    const sportMatch = sports.find((s) => s.name === target.sport);
    if (sportMatch) {
      setIsTeamCompetition(sportMatch.isTeamCompetition);
    }

    const leagueMatch = leagues.find((l) => l.name === target.league);

    reset({
      date: dayjs(target.match_date),
      time: dayjs(target.match_time, "HH:mm"),
      sportId: sportMatch?.id ?? null,
      leagueId: leagueMatch?.id ?? null,
      team1: target.team_one,
      team2: target.team_two,
      note: target.etc,
    });
  }, [props.mode, props.broadcastId, broadcastLists, sports, leagues, reset, addToast]);

  // ⑦ submit — 유효성 통과한 경우만 실행
  const onSubmit = async (data: BroadcastFormValues) => {
    if (!data.date || !data.time || !data.sportId || !data.leagueId) {
      addToast("필수 정보를 모두 입력해주세요.", "error");
      return;
    }

    const commonPayload = {
      match_date: data.date.format("YYYY-MM-DD"),
      match_time: data.time.format("HH:mm"),
      sport_id: data.sportId,
      league_id: data.leagueId,
      team_one: data.team1 ?? "",
      team_two: data.team2 ?? "",
      etc: data.note,
    };

    setIsSubmitting(true);
    try {
      if (props.mode === "create") {
        await createBroadcast({ ...commonPayload, store_id: props.storeId });
        addToast("중계 일정 등록 완료", "success");
      } else if (props.mode === "edit" && props.broadcastId != null) {
        await editBroadcast(props.broadcastId, commonPayload);
        addToast("중계 일정 수정 완료", "success");
      }
      queryClient.invalidateQueries({ queryKey: ["broadcasts", storeId] });
      setRestaurantSubpage("schedule-view-broadcasts");
    } catch {
      addToast("오류가 발생했습니다. 다시 시도해주세요.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ⑧ JSX — Controller로 DatePicker/TimePicker/SelectInput 연결
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1 min-w-[180px]">
          <label className="block mb-1 font-semibold text-mainText">
            날짜 <span className="text-red-500">*</span>
          </label>
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <DatePicker
                className="w-full py-2 border-gray-200"
                value={field.value}
                onChange={(v) => v && field.onChange(v)}
                getPopupContainer={(trigger) => trigger.parentNode as HTMLElement}
              />
            )}
          />
        </div>
        <div className="flex-1 min-w-[180px]">
          <label className="block mb-1 font-semibold text-mainText">
            시간 <span className="text-red-500">*</span>
          </label>
          <Controller
            name="time"
            control={control}
            render={({ field }) => (
              <TimePicker
                className="w-full py-2 border-gray-200"
                format="HH:mm"
                value={field.value}
                onChange={field.onChange}
                getPopupContainer={(trigger) => trigger.parentNode as HTMLElement}
              />
            )}
          />
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 min-w-[180px]">
          <Controller
            name="sportId"
            control={control}
            render={({ field }) => (
              <SelectInput
                label="종목"
                placeholder="종목 선택"
                value={field.value ?? ""}
                options={sports}
                onChange={(id) => {
                  field.onChange(id);
                  setValue("leagueId", null);
                  const selected = sports.find((s) => s.id === id);
                  if (selected) {
                    setIsTeamCompetition(selected.isTeamCompetition);
                    if (!selected.isTeamCompetition) {
                      setValue("team1", "");
                      setValue("team2", "");
                    }
                  }
                }}
              />
            )}
          />
        </div>
        <div className="flex-1 min-w-[180px]">
          <Controller
            name="leagueId"
            control={control}
            render={({ field }) => (
              <SelectInput
                label="리그"
                placeholder="리그 선택"
                value={field.value ?? ""}
                options={leagues}
                onChange={(id) => field.onChange(id)}
                disabled={!sportId}
              />
            )}
          />
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 min-w-[180px]">
          <label className="block mb-1 font-semibold text-mainText">팀 1</label>
          <input
            placeholder={
              isTeamCompetition
                ? "팀 이름을 입력해주세요."
                : "팀 입력이 필요하지 않습니다."
            }
            {...register("team1")}
            disabled={!isTeamCompetition}
            className="w-full border px-3 py-2 rounded-lg hover:border-primary5 focus:border-primary5 focus:ring-1 focus:ring-primary1 focus:outline-none"
          />
        </div>
        <div className="flex-1 min-w-[180px]">
          <label className="block mb-1 font-semibold text-mainText">팀 2</label>
          <input
            placeholder={
              isTeamCompetition
                ? "팀 이름을 입력해주세요."
                : "팀 입력이 필요하지 않습니다."
            }
            {...register("team2")}
            disabled={!isTeamCompetition}
            className="w-full border px-3 py-2 rounded-lg hover:border-primary5 focus:border-primary5 focus:ring-1 focus:ring-primary1 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block mb-1 font-semibold text-mainText">기타</label>
        <textarea
          {...register("note")}
          className="w-full border px-3 py-2 rounded-lg hover:border-primary5 focus:border-primary5 focus:ring-1 focus:ring-primary1 focus:outline-none"
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button
          type="button"
          scheme="ghost"
          size="medium"
          onClick={() => {
            reset();
            setRestaurantSubpage("schedule-view-broadcasts");
          }}
        >
          취소
        </Button>
        <Button
          type="submit"
          scheme="primary"
          size="medium"
          isLoading={isSubmitting}
        >
          {props.mode === "edit" ? "수정" : "등록"}
        </Button>
      </div>
    </form>
  );
};

export default BroadcastRegisterEdit;
