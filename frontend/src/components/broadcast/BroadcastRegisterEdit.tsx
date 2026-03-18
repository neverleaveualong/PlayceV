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

interface BroadcastFormValues {
  date: Dayjs | null;
  time: Dayjs | null;
  sportId: number | null;
  leagueId: number | null;
  team1: string;
  team2: string;
  note: string;
}

const INPUT =
  "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-mainText placeholder-gray-400 hover:border-primary5 focus:border-primary5 focus:outline-none focus:ring-2 focus:ring-primary1 transition-colors";

const BroadcastRegisterEdit = (props: BroadcastRegisterEditProps) => {
  const storeId = useBroadcastStore((state) => state.storeId);
  const { data: broadcastLists = [] } = useBroadcasts(storeId);
  const queryClient = useQueryClient();
  const setRestaurantSubpage = useMypageStore((state) => state.setRestaurantSubpage);
  const [isTeamCompetition, setIsTeamCompetition] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addToast = useToastStore((state) => state.addToast);

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

  const sportId = watch("sportId");
  const { data: sports = [] } = useSports();
  const { data: leagues = [] } = useLeagues(sportId ?? undefined);

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

    reset({
      date: dayjs(target.match_date),
      time: dayjs(target.match_time, "HH:mm"),
      sportId: sportMatch?.id ?? null,
      leagueId: null,
      team1: target.team_one,
      team2: target.team_two,
      note: target.etc,
    });
  }, [props.mode, props.broadcastId, broadcastLists, sports, reset, addToast]);

  useEffect(() => {
    if (props.mode !== "edit" || props.broadcastId == null || leagues.length === 0) return;

    const target = broadcastLists.find(
      (b) => b.broadcast_id === props.broadcastId
    );
    if (!target) return;

    const leagueMatch = leagues.find((l) => l.name === target.league);
    if (leagueMatch) {
      setValue("leagueId", leagueMatch.id);
    }
  }, [props.mode, props.broadcastId, broadcastLists, leagues, setValue]);

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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      {/* 경기 일시 */}
      <Section title="경기 일시">
        <div className="grid grid-cols-2 gap-3">
          <Field label="날짜" required>
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <DatePicker
                  className="!w-full !rounded-xl !border-gray-200 !py-2 hover:!border-primary5"
                  value={field.value}
                  onChange={(v) => v && field.onChange(v)}
                  placeholder="날짜 선택"
                  getPopupContainer={(trigger) => trigger.parentNode as HTMLElement}
                />
              )}
            />
          </Field>
          <Field label="시간" required>
            <Controller
              name="time"
              control={control}
              render={({ field }) => (
                <TimePicker
                  className="!w-full !rounded-xl !border-gray-200 !py-2 hover:!border-primary5"
                  format="HH:mm"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="시간 선택"
                  getPopupContainer={(trigger) => trigger.parentNode as HTMLElement}
                />
              )}
            />
          </Field>
        </div>
      </Section>

      {/* 종목 · 리그 */}
      <Section title="종목 · 리그">
        <div className="grid grid-cols-2 gap-3">
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
      </Section>

      {/* 팀 정보 */}
      <Section title="팀 정보">
        <div className="grid grid-cols-2 gap-3">
          <Field label="홈팀">
            <input
              placeholder={isTeamCompetition ? "홈팀 이름" : "입력 불필요"}
              {...register("team1")}
              disabled={!isTeamCompetition}
              className={`${INPUT} disabled:bg-gray-50 disabled:text-gray-400`}
            />
          </Field>
          <Field label="원정팀">
            <input
              placeholder={isTeamCompetition ? "원정팀 이름" : "입력 불필요"}
              {...register("team2")}
              disabled={!isTeamCompetition}
              className={`${INPUT} disabled:bg-gray-50 disabled:text-gray-400`}
            />
          </Field>
        </div>
        {!isTeamCompetition && (
          <p className="text-xs text-darkgray mt-1">
            개인 종목은 팀 입력이 필요하지 않습니다
          </p>
        )}
      </Section>

      {/* 추가 정보 */}
      <Section title="추가 정보">
        <Field label="메모">
          <textarea
            {...register("note")}
            className={`${INPUT} resize-none`}
            rows={2}
            placeholder="특이사항을 입력하세요 (선택)"
          />
        </Field>
      </Section>

      {/* 제출 버튼 */}
      <Button
        type="submit"
        scheme="primary"
        size="medium"
        fullWidth
        className="!py-2.5 rounded-xl"
        isLoading={isSubmitting}
      >
        {props.mode === "edit" ? "수정 완료" : "중계 일정 등록하기"}
      </Button>
    </form>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm space-y-2.5">
    <h3 className="text-sm font-bold text-mainText">{title}</h3>
    {children}
  </div>
);

const Field = ({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <div>
    <label className="block mb-1 text-xs font-semibold text-darkgray">
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

export default BroadcastRegisterEdit;
