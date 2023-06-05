import { useTransition, animated } from "@react-spring/web";
import { modalAnimation } from "../../../animations";

type FullScreenProps = {
  display: boolean;
};

const FullScreen: React.FC<React.PropsWithChildren<FullScreenProps>> = ({
  children,
  display,
}) => {
  const transition: any = useTransition(display, modalAnimation as any);

  return (
    <>
      {transition((style, display) => (
        <div>
          {display && (
            <div className="mx-auto absolute w-full h-full z-[60] flex items-center justify-center text-black">
              {display && (
                <div className="relative z-[60] w-full h-full">
                  <animated.div
                    style={style}
                    className="modal h-full bg-black text-white box-shadow-lg mx-auto relative overflow-hidden"
                  >
                    {children}
                  </animated.div>
                </div>
              )}
              <div className="absolute bg-frosted top-0 left-0 w-full h-full"></div>
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default FullScreen;
