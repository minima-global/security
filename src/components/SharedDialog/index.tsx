import { ReactNode } from "react";

interface IProps {
  nav?: ReactNode;
  main: ReactNode;
  primary: ReactNode;
  secondary: ReactNode;
  bg?: "primary" | "secondary";
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
      {nav && (
        <div className="absolute top-0 left-0 right-0 max-h-[54px]">{nav}</div>
      )}
      <div
        className={`h-full bg-black absolute left-0 top-0 bottom-0 right-0 grid grid-cols-[1fr_minmax(0,_560px)_1fr] sm:grid-rows-1 ${
          nav ? "top-[54px]" : "top-0"
        } overflow-scroll pb-20`}
      >
        <div />
        <div className="grid md:grid-rows-1 overflow-scroll">
          <div
            className={`px-6 py-10 ${background} rounded mx-4 h-max mt-[66px] md:mt-0 md:self-center`}
          >
            <div>
              {main}
              {primary && <div>{primary}</div>}
              {secondary && <div className="md:block hidden">{secondary}</div>}
            </div>
          </div>
          {secondary && (
            <div className="md:hidden flex mx-4 items-end mb-8">
              {secondary}
            </div>
          )}
        </div>
        <div />
      </div>
    </>
  );
};

export default SharedDialog;
