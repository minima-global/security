import { useTransition, animated } from "@react-spring/web";

interface IProps {
  children: any;
  delay: number;
  loop?: boolean;
  isOpen?: boolean;
}

const SlideIn = ({ isOpen = true, children, delay, loop = false }: IProps) => {
  const transition: any = useTransition(isOpen, {
    from: {
      position: "absolute",
      right: "-1000px",
      opacity: 0,
    },
    enter: {
      position: "relative",
      right: "0",
      opacity: 1,
    },
    leave: {
      right: "0",
      opacity: 0,
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

export default SlideIn;
