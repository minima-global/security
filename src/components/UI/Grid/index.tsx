import useCanUseTitleBar from "../../../hooks/useCanUseTitleBar";
import useGetInnerHeight from "../../../hooks/useGetInnerHeight";
import styles from "./Grid.module.css";

interface IProps {
  header: any;
  content: any;

  fullHeight?: boolean;
}
const Grid = ({ header, content, fullHeight = false }: IProps) => {
  const height = useGetInnerHeight();
  const openTitleBar = useCanUseTitleBar();

  return (
    <div className={styles["grid"]} style={{ height: `${height}px` }}>
      {header && <header onClick={openTitleBar}>{header}</header>}

      <main>
        <section className={fullHeight ? "!h-screen" : ""}>{content}</section>
      </main>
    </div>
  );
};

export default Grid;
