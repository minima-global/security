import * as React from 'react';
import { useTransition, animated } from '@react-spring/web';
import { slideAnimation } from '../../../animations';

type SlideScreenProps = {
  display: boolean;
};

export const SlideScreen: React.FC<React.PropsWithChildren<SlideScreenProps>> = ({ display, children }) => {
  const transition: any = useTransition(display, slideAnimation as any);

  return (
    <div>
      {transition((style, display) => (
        <div>
          {display && (
            <div className="mx-auto absolute w-full h-full z-[60] flex items-center justify-center text-black">
              {display && (
                <div className="relative z-[60] w-full h-full">
                  <animated.div
                    style={style}
                    className="modal h-full text-white box-shadow-lg mx-auto relative overflow-hidden"
                  >
                    {children}
                  </animated.div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SlideScreen;
