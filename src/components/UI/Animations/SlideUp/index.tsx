import { useTransition, animated } from "@react-spring/web";

interface IProps {
  children: any;
  delay: number;
  loop?: boolean;
  isOpen?: boolean;
}

const SlideUp = ({ isOpen = true, children, delay, loop = false }: IProps) => {
  const transition: any = useTransition(isOpen, {
    from: {
      transformY: 0,
      // opacity: 0,
    },
    enter: {
      transformY: "+100%",
      // opacity: 1,
    },
    leave: {
      transformY: 0,
      // opacity: 0,
    },
    delay: delay,
    loop: loop,
  });

  return (
    <>
      {transition(
        (style, isOpen) =>
          !!isOpen && <animated.div style={style}>{children}</animated.div>
      )}
    </>
  );
};

export default SlideUp;
