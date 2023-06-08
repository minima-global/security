import * as React from "react";

type ButtonProps = {
  variant?: "primary" | "secondary";
  onClick?: any;
  disabled?: boolean;
  type?: "submit" | "button";
  extraClass?: string;
};

const Button: React.FC<React.PropsWithChildren<ButtonProps>> = ({
  variant = "primary",
  onClick = null,
  children,
  disabled,
  type = "button",
  extraClass,
}) => {
  let base =
    "w-full px-4 py-3.5 rounded font-bold disabled:opacity-40 disabled:cursor-not-allowed";

  if (extraClass && extraClass.length) {
    base += ` ${extraClass ? extraClass + "" : ""}`;
  }

  if (variant === "primary") {
    base += " text-black bg-white";
  } else if (variant === "secondary") {
    base += " text-white core-black-contrast-3";
  }

  return (
    <button type={type} disabled={disabled} className={base} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
