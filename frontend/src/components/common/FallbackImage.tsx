import { useState } from "react";
import { FiImage } from "react-icons/fi";

interface FallbackImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "onError"> {
  fallbackSrc?: string;
}

const FallbackImage = ({
  src,
  fallbackSrc,
  alt,
  className,
  ...props
}: FallbackImageProps) => {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 text-gray-300 ${className ?? ""}`}
      >
        <FiImage className="text-lg" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
      {...props}
    />
  );
};

export default FallbackImage;
