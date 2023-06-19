import { useState } from "react";

interface IProps {
  placeholder: string;
  type: string;
  value?: any;
  name: string;
  id: string;
  autoComplete?: string;
  extraClass?: string;
  accept?: string;
  onChange?: any;
  onBlur?: any;
  showPassword?: boolean;
  endIcon?: any;
  startIcon?: any;
  error?: string | false;
  webbie?: boolean;
  onKeyUp?: any;
  handleEndIconClick?: () => void;
}
const Input = ({
  accept,
  onChange,
  onBlur,
  placeholder,
  autoComplete,
  type,
  name,
  id,
  extraClass,
  value,
  endIcon,
  startIcon,
  error,
  webbie,
  handleEndIconClick,
  onKeyUp,
}: IProps) => {
  const [focus, setFocus] = useState(false);

  let wrapperBase = "flex flex-row";

  let base =
    "core-black-contrast w-full px-4 py-3.5 rounded disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none";

  if (extraClass) {
    base += ` ${extraClass}`;
  }
  if (error) {
    wrapperBase += " form-error-border";
  }

  if (focus) {
    wrapperBase += " input-outline";
  }

  return (
    <div className={`flex flex-col gap-2`}>
      <div className={wrapperBase}>
        {!!startIcon && (
          <div
            className={`core-black-contrast flex flex-col justify-center pl-4 color-core-grey font-medium ${
              error ? "form-error-message" : ""
            }`}
          >
            {startIcon}
          </div>
        )}
        {webbie && (
          <input
            autoComplete={autoComplete ? autoComplete : ""}
            directory=""
            webkitdirectory="true"
            onBlur={onBlur}
            name={name}
            id={id}
            value={value}
            type={type}
            placeholder={placeholder}
            className={base}
            onChange={onChange}
            accept={accept}
            onKeyUp={onKeyUp}
            onFocus={() => setFocus(true)}
          />
        )}
        {!webbie && (
          <input
            autoComplete={autoComplete ? autoComplete : ""}
            onBlur={onBlur}
            name={name}
            id={id}
            value={value}
            type={type}
            placeholder={placeholder}
            className={base}
            onChange={onChange}
            accept={accept}
            onKeyUp={onKeyUp}
            onFocus={() => setFocus(true)}
          />
        )}
        {!!endIcon && (
          <div
            onClick={handleEndIconClick}
            className="core-black-contrast flex flex-col justify-center pr-4"
          >
            {endIcon}
          </div>
        )}
      </div>

      {error && (
        <div className="text-sm form-error-message text-left">{error}</div>
      )}
    </div>
  );
};

export default Input;
