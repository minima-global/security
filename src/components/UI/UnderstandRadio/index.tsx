interface IProps {
  onChange: () => void;
  children: string;

  htmlFor: string;
  id: string;
  name: string;
  defaultValue?: boolean;
}
const UnderstandRadio = ({
  children,

  defaultValue = false,
  onChange,
  id,
  name,
}: IProps) => {
  const base =
    "core-black-contrast w-full px-4 py-3.5 rounded text-sm flex flex-row justify-items-center align-center gap-3 text-left understand-label core-grey-100 items-center";

  return (
    <div className={base}>
      <input
        defaultChecked={defaultValue}
        onClick={onChange}
        id={id}
        name={name}
        type="checkbox"
      />
      <label htmlFor="understand">{children}</label>
    </div>
  );
};

export default UnderstandRadio;
