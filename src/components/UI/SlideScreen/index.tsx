import { CSSTransition } from "react-transition-group";
// import styles from "./Slide.module.css";
interface IProps {
  display: boolean;
  children: any;
}

export const SlideScreen = ({ display, children }: IProps) => {
  return (
    <CSSTransition
      in={display}
      unmountOnExit
      timeout={200}
      // className={{
      //   enter: styles.slideEnter,
      //   enterDone: styles.slideEnterActive,
      //   exit: styles.slideExit,
      //   exitActive: styles.slideExitActive,
      // }}
    >
      {children}
    </CSSTransition>
  );
};

export default SlideScreen;
