import useCanUseTitleBar from "../../../hooks/useCanUseTitleBar";
import useGetInnerHeight from "../../../hooks/useGetInnerHeight";
import styles from "./Grid.module.css";

interface IProps {
  header: any;
  content: any;
  footer: any;

  fullHeight?: boolean;
}
const Grid = ({ header, content, footer, fullHeight = false }: IProps) => {
  const height = useGetInnerHeight();
  const openTitleBar = useCanUseTitleBar();

  return (
    <div className={styles["grid"]} style={{ height: `${height}px` }}>
      <header onClick={openTitleBar}>{header}</header>

      <main>
        <section className={fullHeight ? "!h-screen" : ""}>{content}</section>
      </main>

      <footer>{footer}</footer>
    </div>
  );
};

export default Grid;
