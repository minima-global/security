import { PropsWithChildren } from 'react';
import { useTransition, animated } from '@react-spring/web';
import { modalAnimation } from '../../../animations';
import Button from '../Button';

type ModalProps = {
  display: boolean;
  frosted: boolean;
  closeAtBottom?: () => void;
};

export const Modal: React.FC<PropsWithChildren<ModalProps>> = ({
  frosted = false,
  closeAtBottom,
  display,
  children,
}) => {
  const transition: any = useTransition(display, modalAnimation as any);

  return (
    <div>
      {transition((style, display) => (
        <div>
          {display && (
            <div className="mx-auto absolute w-full h-full z-[60] flex items-center justify-center text-black">
              <div className="relative z-[80] w-full max-w-md px-5">
                <animated.div
                  style={style}
                  className="modal text-white core-black-contrast-2 box-shadow-lg rounded p-8 mx-auto relative overflow-hidden"
                >
                  {children}
                </animated.div>
              </div>
              {closeAtBottom && (
                <div className="absolute bottom-10 w-full px-8 z-[90]">
                  <Button variant="secondary" onClick={closeAtBottom}>
                    Cancel
                  </Button>
                </div>
              )}
              {frosted && <div className="absolute z-[70] bg-black bg-opacity-90 top-0 left-0 w-full h-full"></div>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Modal;
