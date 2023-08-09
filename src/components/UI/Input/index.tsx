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
  handleEndIconClick,
  onKeyUp,
}: IProps) => {
  let wrapperBase = "flex flex-row";

  let base =
    "core-black-contrast-2 w-full px-4 py-3.5 rounded disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none !focus:border-[#fff] !border-[#fff]";

  if (extraClass) {
    base += ` ${extraClass}`;
  }
  if (error) {
    wrapperBase += " form-error-border";
  }

  return (
    <div className={`flex flex-col gap-2`}>
      <div className={`${wrapperBase} relative`}>
        {!!startIcon && (
          <div className="absolute text-base top-[15px] left-[15px]">
            {startIcon}
          </div>
        )}
        <input
          autoComplete={autoComplete ? autoComplete : ""}
          onBlur={onBlur}
          name={name}
          id={id}
          value={value}
          type={type}
          placeholder={placeholder}
          className={`${base} focus:border-[#464C4F] ${
            startIcon ? "pl-10" : ""
          }`}
          onChange={onChange}
          accept={accept}
          onKeyUp={onKeyUp}
        />

        {!!endIcon && (
          <div
            onClick={handleEndIconClick}
            className="pr-4 absolute right-[1px] top-4 bottom-0"
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
