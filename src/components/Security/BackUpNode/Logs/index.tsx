import { useContext, useEffect } from "react";
import { appContext } from "../../../../AppContext";
import { createPortal } from "react-dom";
import ComposableModal from "../../../ComposableModal";
import Cross from "../../../UI/Cross";

import { animated, config, useSpring } from "react-spring";
import { formatDistanceToNow } from "date-fns";

const BackupLogs = () => {
  const { _backupLogs, promptBackupLogs, _promptBackupLogs, getBackupLogs, loaded } =
    useContext(appContext);

  const springProps = useSpring({
    opacity: _promptBackupLogs ? 1 : 0,
    transform: _promptBackupLogs
      ? "translateY(0%) scale(1)"
      : "translateY(-50%) scale(0.8)",
    config: config.stiff,
  });

  useEffect(() => {
    if (loaded.current)
    getBackupLogs();
  }, [_backupLogs, loaded])

  if (!_promptBackupLogs) {
    return null;
  }

  return (
    <>
      {_promptBackupLogs &&
        createPortal(
          <ComposableModal dismiss={promptBackupLogs}>
            <div className="h-full flex items-center justify-center">
              <animated.div
                style={springProps}
                className="max-w-lg w-full bg-black rounded p-4 min-h-[50vh] md:min-h-[350px] shadow-sm shadow-white mx-4"
              >
                <div className="grid grid-rows-[min-content]">
                  <div className="grid grid-cols-[1fr_auto] p-4">
                    <h3 className="font-bold text-white">Logs</h3>
                    <Cross dismiss={promptBackupLogs} />
                  </div>
                  <div className="px-4 text-sm flex-1 overflow-y-auto">
                    {_backupLogs.length > 0 ? (
                      <div className="max-h-80 overflow-y-auto">
                        <table className="w-full bg-black">
                          <thead className="bg-gradient-to-r from-blue-500 to-indigo-500 sticky top-0">
                            <tr>
                              <th className="py-2 px-4 text-left text-white">
                                Timestamp
                              </th>
                              <th className="py-2 px-4 text-left text-white">
                                Status
                              </th>
                              <th className="py-2 px-4 text-left text-white">
                                Size
                              </th>
                              <th className="py-2 px-4 text-left text-white">
                                Message
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {_backupLogs
                              .sort((a, b) => b.timestamp - a.timestamp)
                              .map((log, index) => (
                                <tr
                                  key={index}
                                  className={
                                    index % 2 === 0
                                      ? "bg-black text-white"
                                      : "bg-gray-900 text-white"
                                  }
                                >
                                  <td className="py-3 px-4">
                                    {formatDistanceToNow(
                                      new Date(log.timestamp),
                                      { addSuffix: true }
                                    )}
                                  </td>
                                  <td className="py-3 px-4">
                                    {log.status === 1 && "Skipped"}
                                    {log.status === 2 && "Done"}
                                    {log.status === 0 && "Pending"}
                                  </td>
                                  <td className="py-3 px-4">{log.size}</td>
                                  <td className="py-3 px-4">{log.message}</td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-center text-gray-400">
                        No logs available yet.
                      </p>
                    )}
                  </div>
                </div>
              </animated.div>
            </div>
          </ComposableModal>,
          document.body
        )}
    </>
  );
};

export default BackupLogs;
