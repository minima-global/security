interface IProps {
  onChange?: any;
  placeholder: string;
  type: string;
  value: string;
  name: string;
  id: string;
  showPassword?: boolean;
  endIcon?: any;
  startIcon?: any;
  error?: string;
}
const Input = ({
  onChange,
  placeholder,
  type,
  name,
  id,
  showPassword,
  value,
  endIcon,
  startIcon,
  error,
}: IProps) => {
  let base =
    "core-black-contrast w-full px-4 py-3.5 rounded disabled:opacity-40 disabled:cursor-not-allowed";

  if (error) {
    base += " form-error-border";
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row">
        {!!startIcon && <div>{startIcon}</div>}
        <input
          name={name}
          id={id}
          value={value}
          type={showPassword && Boolean(showPassword) ? "text" : type}
          placeholder={placeholder}
          className={base}
          onChange={onChange}
        />
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
