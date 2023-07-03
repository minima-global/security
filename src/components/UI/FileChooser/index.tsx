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
}: IProps) => {
  const [focus, setFocus] = useState(false);

  let wrapperBase = "flex flex-row";

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
          key={keyValue}
          autoComplete={autoComplete ? autoComplete : ""}
          onBlur={onBlur}
          name={name}
          id={id}
          type={type}
          placeholder={placeholder}
          className={base}
          onChange={onChange}
          accept={accept}
          onKeyUp={onKeyUp}
          onFocus={() => setFocus(true)}
        />

        {!!endIcon && (
          <div
            onClick={handleEndIconClick}
            className="core-grey-20 rounded-r flex flex-col justify-center pr-4"
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
