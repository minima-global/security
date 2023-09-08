import { To, useNavigate } from "react-router-dom";

interface IProps {
  title: string;
  to?: any;
  onClickHandler?: () => void;
}
const BackButton = ({ title, to, onClickHandler }: IProps) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();

        to ? navigate(to) : onClickHandler ? onClickHandler() : null;
      }}
      className={`flex cursor-pointer items-center`}
    >
      <svg
        className="mr-2"
        width="8"
        height="14"
        viewBox="0 0 8 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.90017 13.1693L0.730957 7.00009L6.90017 0.830872L7.79631 1.72701L2.52324 7.00009L7.79631 12.2732L6.90017 13.1693Z"
          fill="#F9F9FA"
        />
      </svg>
      {title}
    </div>
  );
};

export default BackButton;
