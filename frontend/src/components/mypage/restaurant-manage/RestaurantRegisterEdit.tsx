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
import { useQueryClient } from "@tanstack/react-query";

// ① 폼 값 타입 정의
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

const RestaurantRegisterEdit = ({ mode }: StoreFormModalProps) => {
  const { restaurantEditId, setRestaurantSubpage } = useMypageStore();
  const { addToast } = useToastStore();
  const queryClient = useQueryClient();

  // ② useForm — useState 9개를 대체
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

  // ③ menus, imgUrls는 동적 배열이라 useState 유지
  const [menus, setMenus] = useState<MenuItem[]>([{ name: "", price: "" }]);
  const [imgUrls, setImgUrls] = useState<string[]>([]);

  // ④ 수정 모드: useStoreDetail + reset으로 폼 채우기
  const { data: detail } = useStoreDetail(restaurantEditId ?? 0, {
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

  // ⑤ submit — 유효성 통과한 경우만 실행됨
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

  // ⑥ JSX — register로 input 연결
  return (
    <div className="p-2">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* 가게명 */}
        <div>
          <label className="block mb-1 font-semibold text-gray-700">
            가게명 <span className="text-red-500">*</span>
          </label>
          <input
            className="w-full border rounded px-3 py-2"
            {...register("store_name", { required: "가게명을 입력해주세요" })}
          />
          <ErrorMessage message={errors.store_name?.message} />
        </div>

        {/* 사업자등록번호 (등록 모드만) */}
        {mode === "create" && (
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              사업자등록번호 <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full border rounded px-3 py-2"
              {...register("business_number", { required: "사업자등록번호를 입력해주세요" })}
            />
            <ErrorMessage message={errors.business_number?.message} />
          </div>
        )}

        {/* 주소 */}
        <div>
          <label className="block mb-1 font-semibold text-gray-700">
            주소 <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-3">
            <input
              className="w-full border rounded px-3 py-2"
              {...register("address", { required: "주소를 입력해주세요" })}
              readOnly={true}
            />
            <FindAddressButton
              onCompleted={(addr) => setValue("address", addr)}
            />
          </div>
          <ErrorMessage message={errors.address?.message} />
        </div>

        {/* 전화번호 */}
        <div>
          <label className="block mb-1 font-semibold text-gray-700">
            전화번호 <span className="text-red-500">*</span>
          </label>
          <input
            className="w-full border rounded px-3 py-2"
            {...register("phone", { required: "전화번호를 입력해주세요" })}
          />
          <ErrorMessage message={errors.phone?.message} />
        </div>

        {/* 영업시간 */}
        <div>
          <label className="block mb-1 font-semibold text-gray-700">
            영업시간 <span className="text-red-500">*</span>
          </label>
          <input
            className="w-full border rounded px-3 py-2"
            {...register("opening_hours", { required: "영업시간을 입력해주세요" })}
          />
          <ErrorMessage message={errors.opening_hours?.message} />
        </div>

        {/* 업종 */}
        <div>
          <label className="block mb-1 font-semibold text-gray-700">
            업종 <span className="text-red-500">*</span>
          </label>
          <input
            className="w-full border rounded px-3 py-2"
            {...register("type", { required: "업종을 입력해주세요" })}
          />
          <ErrorMessage message={errors.type?.message} />
        </div>

        {/* 메뉴 (동적 배열 — useState 유지) */}
        <MenuInputList menus={menus} setMenus={setMenus} />

        {/* 소개 (선택) */}
        <div>
          <label className="block mb-1 font-semibold text-gray-700">소개</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            {...register("description")}
            rows={3}
            placeholder="식당을 소개해 주세요 (선택)"
          />
        </div>

        {/* 사진 */}
        <div>
          <label className="block mb-1 font-semibold text-gray-700">
            사진 <span className="text-red-500">*</span>
          </label>
          <ImageUrlInputList
            imgUrls={imgUrls}
            setImgUrls={setImgUrls}
          />
        </div>

        {/* 약관 동의 (등록 모드만) */}
        {mode === "create" && (
          <>
            <div className="flex mt-5 items-start gap-2">
              <input
                type="checkbox"
                id="agreement"
                {...register("agree", { required: "중계권 관련 약관에 동의해야 등록이 가능합니다." })}
                className="mt-1"
              />
              <label
                htmlFor="agreement"
                className="text-sm text-gray-700 select-none"
              >
                <span className="font-semibold text-red-500">[필수]</span>{" "}
                본인은{" "}
                <b>
                  스포츠 중계권 및 저작권 관련 법적 책임이 본 플랫폼에 없음을
                  확인하고 동의합니다.
                </b>
                <br />
                (중계 영상 송출, 저작권 침해 등은 등록자 본인의 책임입니다)
              </label>
            </div>
            {errors.agree && (
              <div className="text-xs text-red-500 mt-1">{errors.agree.message}</div>
            )}
          </>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="submit"
            className="px-4 py-2 rounded bg-primary5 text-white font-bold"
          >
            {mode === "edit" ? "수정" : "등록"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RestaurantRegisterEdit;
