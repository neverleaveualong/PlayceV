import { useState } from "react";

interface FallbackImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

const FallbackImage = ({
  src,
  fallbackSrc = "/noimg.png",
  alt,
  ...props
}: FallbackImageProps) => {
  const [failed, setFailed] = useState(false);

  return (
    <img
      src={failed ? fallbackSrc : src || fallbackSrc}
      alt={alt}
      onError={() => { if (!failed) setFailed(true); }}
      {...props}
    />
  );
};

export default FallbackImage;
