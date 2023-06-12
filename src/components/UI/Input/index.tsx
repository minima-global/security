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
  error?: string;
  webbie?: boolean;
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
  showPassword,
  value,
  endIcon,
  startIcon,
  error,
  webbie,
}: IProps) => {
  let base =
    "core-black-contrast w-full px-4 py-3.5 rounded disabled:opacity-40 disabled:cursor-not-allowed";

  if (extraClass) {
    base += ` ${extraClass}`;
  }
  if (error) {
    base += " form-error-border";
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row">
        {!!startIcon && <div>{startIcon}</div>}
        {webbie && (
          <input
            autoComplete={autoComplete ? autoComplete : ""}
            directory=""
            webkitdirectory="true"
            onBlur={onBlur}
            name={name}
            id={id}
            value={value}
            type={showPassword && Boolean(showPassword) ? "text" : type}
            placeholder={placeholder}
            className={base}
            onChange={onChange}
            accept={accept}
          />
        )}
        {!webbie && (
          <input
            autoComplete={autoComplete ? autoComplete : ""}
            onBlur={onBlur}
            name={name}
            id={id}
            value={value}
            type={showPassword && Boolean(showPassword) ? "text" : type}
            placeholder={placeholder}
            className={base}
            onChange={onChange}
            accept={accept}
          />
        )}
        {!!endIcon && (
          <div className="core-black-contrast flex flex-col justify-center pr-4">
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
