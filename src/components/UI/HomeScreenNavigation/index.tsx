import { ReactNode } from "react";
import RightArrow from "../../Icons/RightArrow";
import { useNavigate } from "react-router-dom";

interface IProps {
  children: ReactNode;
  icon?: ReactNode;
  location?: string;
  extraClass?: string;
  handleClick?: () => void;
}
const HomeScreenNavigation = ({ extraClass, location, children, icon, handleClick }: IProps) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => location ? navigate(location) : handleClick ? handleClick() : null}
      className={`bg-[#1B1B1B] p-4 rounded grid grid-cols-[1fr_auto] cursor-pointer ${extraClass && extraClass}`}
    >
      <span className="text-sm tracking-wide opacity-80 font-bold">{children}</span>
      <span className="my-auto">
        {!icon && <span className="text-gray-300"><RightArrow /></span>}
        {icon && icon}
      </span>
    </div>
  );
};

export default HomeScreenNavigation;
