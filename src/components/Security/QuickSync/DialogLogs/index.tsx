import { useRef, useEffect, useContext } from "react";
import { appContext } from "../../../../AppContext";
import RefreshIcon from "../../../Icons/RefreshIcon";

const DialogLogs = () => {
  const { logs: cliLogs, setLogs } = useContext(appContext);
  const logsEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    setLogs([]);  
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [cliLogs]);

  return (
    <>
      {cliLogs.length === 0 && (
        <div className="grid grid-cols-[1fr_auto] my-3 items-center">
          <p className="text-xs animate-pulse">Loading logs...</p>
          <span className="text-teal-300 my-auto">
            <RefreshIcon
              fill="currentColor"
              extraClass="animate-spin w-[16px]"
            />
          </span>
        </div>
      )}
      {cliLogs.length > 0 && (
        <div className="my-3">
          <div className="grid grid-cols-[1fr_auto_1fr] gap-2">
            <hr className="border-sky-400 pb-1 mt-2" />
            <p className="text-xs text-center text-white font-bold">CLI Logs</p>

            <hr className="border-sky-400 pb-1 mt-2" />
          </div>

          <div className="bg-[#1B1B1B] rounded-lg px-3 py-3 overflow-auto max-h-[200px] grid gap-2">
            {cliLogs.map((l) => (
              <span key={l} className="text-xs">{l}</span>
            ))}
            <div ref={logsEndRef} />
          </div>
        </div>
      )}
    </>
  );
};

export default DialogLogs;
