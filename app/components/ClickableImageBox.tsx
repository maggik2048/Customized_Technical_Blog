"use client";

type Props = {
  imageSrc: string;
  width?: number;
  height?: number;
  onClick?: () => void;
};

export default function ClickableImageBox({
  imageSrc,
  width = 260,
  height = 160,
  onClick,
}: Props) {
  return (
    <div
      onClick={onClick}
      style={{
        width,
        height,
        borderRadius: "12px",
        overflow: "hidden",
        cursor: "pointer",
        backgroundImage: `url(${imageSrc})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        transition: "transform 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.05)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
    />
  );
}