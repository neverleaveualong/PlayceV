import SectionHeader from "@/components/common/SectionHeader";

export interface UserInfoProps {
  email: string;
  name: string;
  nickname: string;
  phone: string;
  onClose?: () => void;
}

const UserInfo = ({ email, name, nickname, phone, onClose }: UserInfoProps) => {
  return (
    <div>
      <SectionHeader title="내 정보" onClose={onClose} />
      <div className="flex flex-col gap-3 mt-2">
        <InfoRow label="이메일" value={email} />
        <InfoRow label="이름" value={name} />
        <InfoRow label="닉네임" value={nickname} />
        <InfoRow label="전화번호" value={phone} />
      </div>
    </div>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center py-2 border-b border-gray-100 last:border-b-0">
    <span className="w-24 text-sm text-gray-500 flex-shrink-0">{label}</span>
    <span className="text-sm text-gray-900">{value}</span>
  </div>
);

export default UserInfo;
