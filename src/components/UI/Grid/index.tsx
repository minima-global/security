import styles from "./Grid.module.css";

interface IProps {
  header: any;
  content: any;
  footer: any;
}
const Grid = ({ header, content, footer }: IProps) => {
  return (
    <div className={styles["grid"]}>
      <header>{header}</header>

      <main>
        <section>{content}</section>
      </main>

      <footer>{footer}</footer>
    </div>
  );
};

export default Grid;
