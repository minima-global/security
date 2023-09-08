import { useState } from "react";

interface IProps {
  placeholder: string;
  type: string;
  name: string;
  id: string;
  keyValue: any;
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
  disabled: boolean;
}
const FileChooser = ({
  accept,
  onChange,
  onBlur,
  placeholder,
  autoComplete,
  type,
  name,
  id,
  extraClass,
  endIcon,
  error,
  handleEndIconClick,
  onKeyUp,
  keyValue,
  disabled,
}: IProps) => {
  const [focus, setFocus] = useState(false);

  let wrapperBase = "flex flex-row relative";

  let base =
    "core-grey-20 font-medium color-black w-full px-4 py-3.5 rounded rounded-r-none disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none";

  if (extraClass) {
    base += ` ${extraClass}`;
  }
  if (error) {
    wrapperBase += " form-error-border";
  }

  if (focus) {
    wrapperBase += " input-outline";
  }

  if (!focus) {
    wrapperBase += " input-no-outline";
  }

  return (
    <div className={`flex flex-col gap-2`}>
      <div className={wrapperBase}>
        <input
          disabled={disabled}
          key={keyValue}
          autoComplete={autoComplete ? autoComplete : ""}
          onBlur={onBlur}
          name={name}
          id={id}
          type={type}
          placeholder={placeholder}
          className={`${base} ${endIcon ? "pr-12" : ""}`}
          onChange={onChange}
          accept={accept}
          onKeyUp={onKeyUp}
          onFocus={() => setFocus(true)}
        />

        {!!endIcon && (
          <div
            onClick={disabled ? undefined : handleEndIconClick}
            className="pr-4 absolute right-[1px] top-[12.5px] bottom-0"
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

export default FileChooser;
