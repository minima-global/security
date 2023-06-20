import styles from "./Tooltip.module.css";

interface IProps {
  content: string;
  position: number;
  onClick: () => void;
  extraClass?: string;
}
const Tooltip = ({ content, position, onClick, extraClass }: IProps) => {
  return (
    <div onClick={onClick} className={`${styles.tooltip} ${extraClass}`}>
      {content}
      <div
        className={styles["tooltip-hook"]}
        style={{ left: position + "px" }}
      ></div>
    </div>
  );
};

export default Tooltip;
