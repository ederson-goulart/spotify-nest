import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export default function Button({
  children,
  onClick,
  className = "",
  disabled = false,
  type = "button",
}: Props) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm  ${disabled ? "text-gray-950 bg-gray-100 hover:bg-gray-100 cursor-pointer" : "text-gray-50 bg-gray-800 hover:bg-gray-950 cursor-pointer"} ${className}`}
    >
      {children}
    </button>
  );
}
