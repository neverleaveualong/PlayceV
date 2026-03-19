import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useStoreDetail from "@/hooks/useStoreDetail";
import ErrorMessage from "@/components/common/ErrorMessage";
import MenuInputList from "./MenuInputList";
import {
  editStore,
  registerStore,
  type EditStoreProps,
  type RegisterStoreProps,
} from "@/api/restaurant.api";
import useMypageStore from "@/stores/mypageStore";
import FindAddressButton from "@/components/common/FindAddressButton";
import ImageUrlInputList from "./ImageUrlInputList";
import type { MenuItem } from "@/types/restaurant.types";
import { getApiErrorMessage } from "@/utils/apiErrorStatusMessage";
import useToastStore from "@/stores/toastStore";
import Button from "@/components/common/Button";
import { useQueryClient } from "@tanstack/react-query";

interface StoreFormValues {
  store_name: string;
  business_number: string;
  address: string;
  phone: string;
  opening_hours: string;
  type: string;
  description: string;
  agree: boolean;
}

interface StoreFormModalProps {
  mode: "create" | "edit";
}

const INPUT =
  "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-mainText placeholder-gray-400 hover:border-primary5 focus:border-primary5 focus:outline-none focus:ring-2 focus:ring-primary1 transition-colors";

const RestaurantRegisterEdit = ({ mode }: StoreFormModalProps) => {
  const { restaurantEditId, setRestaurantSubpage } = useMypageStore();
  const { addToast } = useToastStore();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<StoreFormValues>({
    defaultValues: {
      store_name: "",
      business_number: "",
      address: "",
      phone: "",
      opening_hours: "",
      type: "",
      description: "",
      agree: false,
    },
  });

  const [menus, setMenus] = useState<MenuItem[]>([{ name: "", price: "" }]);
  const [imgUrls, setImgUrls] = useState<string[]>([]);

  const { data: detail, isLoading: isDetailLoading } = useStoreDetail(restaurantEditId ?? 0, {
    enabled: mode === "edit" && !!restaurantEditId,
  });

  useEffect(() => {
    if (!detail) return;
    reset({
      store_name: detail.store_name,
      address: detail.address,
      phone: detail.phone,
      opening_hours: detail.opening_hours,
      type: detail.type,
      description: detail.description,
    });
    setMenus(detail.menus);
    setImgUrls(detail.img_urls);
  }, [detail, reset]);

  const onSubmit = async (data: StoreFormValues) => {
    if (mode === "create") {
      const payload: RegisterStoreProps = {
        store_name: data.store_name,
        address: data.address,
        phone: data.phone,
        business_number: data.business_number,
        opening_hours: data.opening_hours,
        menus: menus.filter(Boolean),
        type: data.type,
        description: data.description,
        images: imgUrls.filter(Boolean),
      };
      try {
        await registerStore(payload);
        queryClient.invalidateQueries({ queryKey: ["myStores"] });
        addToast("식당 등록이 완료되었습니다.", "success");
        setRestaurantSubpage("restaurant-home");
      } catch (error) {
        addToast(getApiErrorMessage(error), "error");
      }
    } else {
      const payload: EditStoreProps = {
        store_name: data.store_name,
        address: data.address,
        phone: data.phone,
        opening_hours: data.opening_hours,
        menus: menus.filter(Boolean),
        type: data.type,
        description: data.description,
        images: imgUrls.filter(Boolean),
      };
      try {
        await editStore(payload, restaurantEditId!);
        queryClient.invalidateQueries({ queryKey: ["myStores"] });
        addToast("식당 수정이 완료되었습니다.", "success");
        setRestaurantSubpage("restaurant-home");
      } catch (error) {
        addToast(getApiErrorMessage(error), "error");
      }
    }
  };

  if (mode === "edit" && isDetailLoading) {
    return <FormSkeleton />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* 기본 정보 섹션 */}
      <Section title="기본 정보">
        <Field label="가게명" required error={errors.store_name?.message}>
          <input className={INPUT} {...register("store_name", { required: "가게명을 입력해주세요" })} placeholder="예: 홍대 스포츠치킨" />
        </Field>

        {mode === "create" && (
          <Field label="사업자등록번호" required error={errors.business_number?.message}>
            <input className={INPUT} {...register("business_number", { required: "사업자등록번호를 입력해주세요" })} placeholder="000-00-00000" />
          </Field>
        )}

        <Field label="주소" required error={errors.address?.message}>
          <div className="flex gap-2">
            <input className={INPUT} {...register("address", { required: "주소를 입력해주세요" })} readOnly placeholder="주소 찾기를 눌러주세요" />
            <FindAddressButton onCompleted={(addr) => setValue("address", addr)} />
          </div>
        </Field>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="전화번호" required error={errors.phone?.message}>
            <input className={INPUT} {...register("phone", { required: "전화번호를 입력해주세요" })} placeholder="02-0000-0000" />
          </Field>
          <Field label="업종" required error={errors.type?.message}>
            <input className={INPUT} {...register("type", { required: "업종을 입력해주세요" })} placeholder="예: 치킨" />
          </Field>
        </div>

        <Field label="영업시간" required error={errors.opening_hours?.message}>
          <input className={INPUT} {...register("opening_hours", { required: "영업시간을 입력해주세요" })} placeholder="예: 매일 15:00 ~ 01:00" />
        </Field>
      </Section>

      {/* 메뉴 섹션 */}
      <Section title="메뉴">
        <MenuInputList menus={menus} setMenus={setMenus} />
      </Section>

      {/* 추가 정보 섹션 */}
      <Section title="추가 정보">
        <Field label="소개">
          <textarea
            className={INPUT + " resize-none"}
            {...register("description")}
            rows={3}
            placeholder="식당을 소개해 주세요 (선택)"
          />
        </Field>

        <Field label="사진" required>
          <ImageUrlInputList imgUrls={imgUrls} setImgUrls={setImgUrls} />
        </Field>
      </Section>

      {/* 약관 동의 */}
      {mode === "create" && (
        <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
          <label htmlFor="agreement" className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              id="agreement"
              {...register("agree", { required: "중계권 관련 약관에 동의해야 등록이 가능합니다." })}
              className="mt-0.5 w-4 h-4 accent-primary5 rounded"
            />
            <span className="text-xs text-darkgray leading-relaxed">
              <span className="font-bold text-red-500">[필수]</span>{" "}
              본인은 스포츠 중계권 및 저작권 관련 법적 책임이 본 플랫폼에 없음을 확인하고 동의합니다.
              <br />
              <span className="text-gray-400">(중계 영상 송출, 저작권 침해 등은 등록자 본인의 책임입니다)</span>
            </span>
          </label>
          {errors.agree && (
            <p className="text-xs text-red-500 mt-2 ml-7">{errors.agree.message}</p>
          )}
        </div>
      )}

      {/* 제출 버튼 */}
      <div className="pb-4">
        <Button type="submit" scheme="primary" size="medium" fullWidth className="!py-2.5 rounded-xl text-sm">
          {mode === "edit" ? "수정 완료" : "식당 등록하기"}
        </Button>
      </div>
    </form>
  );
};

/* 섹션 카드 */
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm space-y-4">
    <h3 className="text-sm font-bold text-mainText">{title}</h3>
    {children}
  </div>
);

/* 필드 래퍼 */
const Field = ({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) => (
  <div>
    <label className="block mb-1.5 text-xs font-semibold text-darkgray">
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
    <ErrorMessage message={error} />
  </div>
);

/* 로딩 스켈레톤 */
const Bone = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-100 rounded-xl ${className}`} />
);

const FormSkeleton = () => (
  <div className="space-y-5">
    {/* 기본 정보 */}
    <div className="rounded-xl border border-gray-100 bg-white p-4 space-y-4 shadow-sm">
      <Bone className="h-4 w-16" />
      <Bone className="h-10 w-full" />
      <Bone className="h-10 w-full" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Bone className="h-10 w-full" />
        <Bone className="h-10 w-full" />
      </div>
      <Bone className="h-10 w-full" />
    </div>
    {/* 메뉴 */}
    <div className="rounded-xl border border-gray-100 bg-white p-4 space-y-4 shadow-sm">
      <Bone className="h-4 w-10" />
      <Bone className="h-10 w-full" />
      <Bone className="h-10 w-full" />
    </div>
    {/* 추가 정보 */}
    <div className="rounded-xl border border-gray-100 bg-white p-4 space-y-4 shadow-sm">
      <Bone className="h-4 w-16" />
      <Bone className="h-20 w-full" />
      <Bone className="h-24 w-full" />
    </div>
  </div>
);

export default RestaurantRegisterEdit;
