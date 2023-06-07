import styles from "./Grid.module.css";

interface IProps {
  header: any;
  content: any;
  footer: any;

  fullHeight?: boolean;
}
const Grid = ({ header, content, footer, fullHeight = false }: IProps) => {
  return (
    <div className={styles["grid"]}>
      <header>{header}</header>

      <main>
        <section className={fullHeight ? "!h-screen" : ""}>{content}</section>
      </main>

      <footer>{footer}</footer>
    </div>
  );
};

export default Grid;
