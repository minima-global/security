import styles from "./Toggle.module.css";

interface IProps {
  onChange: any;
  checkedStatus: boolean;
}
const Toggle = ({ onChange, checkedStatus }: IProps) => {
  return (
    <label className={styles.switch}>
      <input checked={checkedStatus} type="checkbox" onChange={onChange} />
      <span className={`${styles.slider} ${styles.round}`}></span>
    </label>
  );
};

export default Toggle;
