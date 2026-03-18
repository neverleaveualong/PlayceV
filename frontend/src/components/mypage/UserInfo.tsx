import { useState } from "react";
import { FaPen, FaCheck, FaTimes, FaStore, FaHeart } from "react-icons/fa";
import InputText from "@/components/common/InputText";
import { useUpdateNickname } from "@/hooks/useUser";

export interface UserInfoProps {
  email: string;
  name: string;
  nickname: string;
  phone: string;
  storeCount: number;
  favoriteCount: number;
}

const UserInfo = ({
  email,
  name,
  nickname,
  phone,
  storeCount,
  favoriteCount,
}: UserInfoProps) => {
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [nicknameInput, setNicknameInput] = useState(nickname);
  const { mutate: updateNickname, isPending } = useUpdateNickname();

  const initial = nickname?.charAt(0) || name?.charAt(0) || "?";

  const handleSaveNickname = () => {
    const trimmed = nicknameInput.trim();
    if (!trimmed || trimmed === nickname) {
      setIsEditingNickname(false);
      setNicknameInput(nickname);
      return;
    }
    updateNickname(trimmed, {
      onSuccess: () => setIsEditingNickname(false),
      onError: () => setNicknameInput(nickname),
    });
  };

  const handleCancelEdit = () => {
    setNicknameInput(nickname);
    setIsEditingNickname(false);
  };

  return (
    <div className="flex flex-col justify-center h-full gap-3">
      {/* 타이틀 */}
      <h2 className="text-xl font-semibold text-mainText flex-shrink-0">내 정보</h2>

      {/* 프로필 히어로 */}
      <div className="bg-gradient-to-br from-primary3 to-primary4 rounded-xl py-5 px-5 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary5 flex items-center justify-center text-white text-xl font-bold shadow-md flex-shrink-0">
            {initial}
          </div>
          <div className="min-w-0">
            <p className="text-lg font-bold text-mainText truncate leading-snug">{nickname}</p>
            <p className="text-sm text-darkgray truncate leading-snug">{email}</p>
          </div>
        </div>
      </div>

      {/* 활동 통계 */}
      <div className="grid grid-cols-2 gap-3 flex-shrink-0">
        <StatCard icon={<FaStore />} label="등록 식당" value={storeCount} />
        <StatCard icon={<FaHeart />} label="즐겨찾기" value={favoriteCount} />
      </div>

      {/* 기본 정보 카드 */}
      <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex-shrink-0">
        <h3 className="text-xs font-semibold text-darkgray mb-3">기본 정보</h3>
          <div className="flex flex-col gap-3">
            <InfoRow label="이름" value={name} />
            {/* 닉네임 - 인라인 수정 */}
            <div className="flex items-center">
              <span className="w-20 text-sm text-darkgray flex-shrink-0">닉네임</span>
              {isEditingNickname ? (
                <div className="flex items-center gap-2 flex-1 ml-2">
                  <InputText
                    value={nicknameInput}
                    onChange={(e) => setNicknameInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveNickname();
                      if (e.key === "Escape") handleCancelEdit();
                    }}
                    className="!py-1 !text-sm"
                    maxLength={20}
                    autoFocus
                    disabled={isPending}
                  />
                  <button
                    onClick={handleSaveNickname}
                    disabled={isPending}
                    className="p-1.5 text-primary5 hover:bg-primary4 rounded-lg transition-colors"
                    aria-label="저장"
                  >
                    <FaCheck size={12} />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    disabled={isPending}
                    className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="취소"
                  >
                    <FaTimes size={12} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 flex-1 ml-2">
                  <span className="text-sm text-mainText">{nickname}</span>
                  <button
                    onClick={() => setIsEditingNickname(true)}
                    className="p-1 text-gray-400 hover:text-primary5 hover:bg-primary4 rounded-lg transition-colors"
                    aria-label="닉네임 수정"
                  >
                    <FaPen size={10} />
                  </button>
                </div>
              )}
            </div>
            <InfoRow label="전화번호" value={formatPhone(phone)} />
          </div>
        </div>

      {/* 계정 정보 카드 */}
      <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex-shrink-0">
        <h3 className="text-xs font-semibold text-darkgray mb-3">계정 정보</h3>
        <InfoRow label="이메일" value={email} />
      </div>
    </div>
  );
};

const StatCard = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) => (
  <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm">
    <div className="w-8 h-8 rounded-lg bg-primary4 text-primary5 flex items-center justify-center text-sm">
      {icon}
    </div>
    <div>
      <p className="text-xs text-darkgray leading-tight">{label}</p>
      <p className="text-base font-bold text-mainText leading-tight">{value}</p>
    </div>
  </div>
);

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center">
    <span className="w-20 text-sm text-darkgray flex-shrink-0">{label}</span>
    <span className="text-sm text-mainText ml-2">{value}</span>
  </div>
);

const formatPhone = (phone: string) => {
  if (!phone) return "-";
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }
  return phone;
};

export default UserInfo;
