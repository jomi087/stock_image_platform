import React from "react";

type ButtonProps = {
  text: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
};

export const Button = ({
  text,
  onClick,
  type = "button",
  disabled = false,
}: ButtonProps) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const gradientClass = disabled
    ? "bg-gray-400"
    : isHovered
    ? "bg-[linear-gradient(135deg,#764ba2_0%,#667eea_100%)]"
    : "bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)]";

  const shadowClass =
    isHovered && !disabled
      ? "shadow-[0_10px_20px_rgba(102,126,234,0.4)]"
      : "shadow-md";

  const transformClass =
    isHovered && !disabled ? "-translate-y-[2px]" : "translate-y-0";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`w-full mt-2 px-4 py-3.5 rounded-[10px] border-none text-white font-semibold text-[15px] transition-all duration-300 ease-in-out
        ${gradientClass}
        ${shadowClass}
        ${transformClass}
        ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      {text}
    </button>
  );
};
