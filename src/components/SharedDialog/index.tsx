import { ReactNode } from "react";

interface IProps {
  nav?: ReactNode;
  main: ReactNode;
  primary: ReactNode;
  secondary: ReactNode;
  bg?: "primary" | "secondary";
  size?: "md" | "lg";
}

const SharedDialog = ({
  nav,
  main,
  primary,
  secondary,
  bg = "primary",
}: IProps) => {
  let background = "";
  if (bg === "secondary") {
    background = "core-black-contrast-2";
  }

  if (bg === "primary") {
    background = "core-black-contrast";
  }

  return (
    <>
      <div className="h-full bg-black absolute left-0 top-0 bottom-0 right-0 grid grid-rows-[auto_1fr] grid-cols-1 overflow-hidden">
        <div className="relative top-0 left-0 right-0 max-h-[54px]">
          {nav ? nav : <div className="h-[48px]" />}
        </div>
        <div
          className={`overflow-y-auto grid grid-cols-[1fr_minmax(0,_560px)_1fr] lg:grid-cols-[1fr_minmax(0,_900px)_1fr]`}
        >
          <div />
          <div className="grid md:grid-rows-1">
            <div
              className={`px-6 pt-8 pb-8 h-max mb-8 ${background} rounded mx-4 md:mx-0 md:mt-0 md:self-center`}
            >
              {main}
              {primary}
              {secondary && <div className="md:block hidden">{secondary}</div>}
            </div>
            {secondary && (
              <div className="md:hidden flex mx-4 items-end mb-8">
                {secondary}
              </div>
            )}
          </div>
          <div />
        </div>
      </div>
    </>
  );
};

export default SharedDialog;
