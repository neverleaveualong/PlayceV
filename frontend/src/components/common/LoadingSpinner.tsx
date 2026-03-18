interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({
  message = "로딩 중...",
}: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-primary5" />
      <span className="text-sm text-gray-500">{message}</span>
    </div>
  );
}
