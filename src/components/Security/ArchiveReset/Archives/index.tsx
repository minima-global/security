import { createPortal } from "react-dom";
import React, { useContext, useEffect, useState, useRef } from "react";
import { appContext } from "../../../../AppContext";
import * as fileManager from "../../../../__minima__/libs/fileManager";

import { animated, config, useSpring } from "react-spring";
import { format } from "date-fns";
import ConfirmDelete from "../../ConfirmDelete";
import Cross from "../../../UI/Cross";
import ComposableModal from "../../../ComposableModal";

const Archives = () => {
  const [searchText, setSearchText] = useState("");
  const { getArchives, archives, _promptArchives, promptArchives, loaded } =
    useContext(appContext);
  const [dropdownIndex, setDropdownIndex] = useState(-1); // State to track the index of the item with an open dropdown
  const [_promptDeleteFile, setPromptDeleteFile] = useState<string | false>(
    false
  );
  const dropdownRef = useRef(null); // Ref to the dropdown menu

  useEffect(() => {
    if (loaded && loaded.current) getArchives();
  }, [loaded, _promptArchives]);

  const springProps = useSpring({
    opacity: _promptArchives ? 1 : 0,
    transform: _promptArchives
      ? "translateY(0%) scale(1)"
      : "translateY(-50%) scale(0.8)",
    config: config.stiff,
  });

  const toggleDropdown = (index) => {
    if (dropdownIndex === index) {
      setDropdownIndex(-1); // Close the dropdown if it's already open
    } else {
      setDropdownIndex(index); // Open the dropdown for the selected item
    }
  };

  const promptDeleteFile = (file: string | false) => {
    setPromptDeleteFile(file);
  };

  // Function to close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // @ts-ignore
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownIndex(-1); // Close dropdown when clicking outside the dropdown menu
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const createDownloadLink = (folder: string, mdsfile: string) => {
    const origFilePath = `/${folder}/${mdsfile}`;
    const newFilePath = `/my_downloads/${mdsfile}_minima_download_as_file_`;

    (window as any).MDS.file.copytoweb(origFilePath, newFilePath, async function () {
      const url = `my_downloads/${mdsfile}` + "_minima_download_as_file_";
      // create an a
      const temporaryLink = document.createElement("a");
      temporaryLink.style.display = "none";
      temporaryLink.target = "_blank";
      temporaryLink.href = url;
      temporaryLink.click();
      await new Promise(resolve => setTimeout(resolve, 5000));

      (window as any).MDS.file.deletefromweb(url, function () {
        temporaryLink.remove();
      });
    });
  };

  const handleDelete = async (archiveFile: string) => {
    await fileManager.deleteFile("/archives/" + archiveFile).then(() => {
      getArchives();
      promptDeleteFile(false);
    });
  };

  const makeTimestamp = (filename: string) => {
    const regex = /archive_export_(\d+)__([^_]+)_(\d+)\.raw\.dat$/;
    // Extracting components from the filename using regex
    const match = filename.match(regex);
    filename.match(regex);
    if (!match) return "";

    const timestamp = parseInt(match[1]);

    // Convert timestamp to Date object
    const timestampDate = new Date(timestamp);

    // Format the timestamp using date-fns
    return format(timestampDate, "dd/MM/yyyy HH:mm");
  };

  if (!_promptArchives) {
    return null;
  }

  const renderArchiveItem = (b, i) => (
    <li
      onClick={() => toggleDropdown(i)}
      className="relative font-normal p-4 pr-1 core-grey-5 rounded color-black grid grid-cols-[1fr_auto] md:grid-cols-1 h-max"
      key={i}
    >
      <div>
        <h3 className="font-bold">Archive</h3>
        <p className="font-medium text-sm break-word">
          {makeTimestamp(b.name)}
        </p>
      </div>
      <div className="md:hidden z-[2] flex items-center justify-center">
        <svg
          onClick={() => toggleDropdown(i)}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="#000000"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
          <path d="M12 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
          <path d="M12 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
        </svg>
      </div>
      {dropdownIndex === i && (
        <div
          ref={dropdownRef}
          className="absolute right-0 md:left-0 mt-2 w-auto bg-white z-[25] border border-gray-200 rounded-md shadow-md"
        >
          <a
            className="block px-4 py-4 text-gray-800 hover:bg-gray-200"
            onClick={(e) => {
              e.stopPropagation(); // Prevent click on dropdown from closing the dropdown
              promptDeleteFile(b.name);
            }}
          >
            Delete
          </a>
          {window.navigator.userAgent.includes("Minima Browser") && (
            <a
              className="block px-4 py-4 text-gray-800 hover:bg-gray-200"
              onClick={async (e) => {
                e.stopPropagation(); // Prevent click on dropdown from closing the dropdown
                const fullPath = await fileManager.getPath(
                  "/archives/" + b.name
                );
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                Android.shareFile(fullPath, "*/*");
              }}
            >
              Share
            </a>
          )}
          <a
            className="block px-4 py-4 text-gray-800 hover:bg-gray-200"
            onClick={(e) => {
              e.stopPropagation();

              if (window.navigator.userAgent.includes("Minima Browser")) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                return Android.fileDownload(
                  (window as any).MDS.minidappuid,
                  "/archives/" + b.name
                );
              }

              createDownloadLink("archives", b.name);
            }}
          >
            Download
          </a>
        </div>
      )}
    </li>
  );

  return (
    <>
      {_promptDeleteFile && (
        <ConfirmDelete
          deleteBackup={() => handleDelete(_promptDeleteFile)}
          close={() => promptDeleteFile(false)}
          isDeleteConfirmationOpen={_promptDeleteFile}
        />
      )}
      {_promptArchives &&
        createPortal(
          <ComposableModal dismiss={promptArchives}>
            <div className="h-full flex items-center justify-center">
              <animated.div
                style={springProps}
                className="max-w-lg w-full bg-black rounded p-4 py-0 shadow-sm shadow-white mx-4 min-h-[50vh] md:min-h-[350px] max-h-32 overflow-y-auto"
              >
                <div className="grid grid-rows-[min-content]">
                  <div className="sticky top-0 z-10 bg-black p-4">
                    <div className="grid grid-cols-[1fr_auto]">
                      <h3 className="font-bold text-white">Latest Archives</h3>
                      <Cross dismiss={promptArchives} />
                    </div>
                    {!!archives.length && (
                      <div className="my-4 bg-black">
                        <input
                          disabled={false}
                          id="search"
                          name="search"
                          type="text"
                          placeholder="Search archives by date"
                          onChange={handleChange}
                          className="w-full bg-black text-white border border-gray-600 rounded px-3 py-2"
                          autoComplete="off"
                        />
                      </div>
                    )}
                  </div>

                  <div className="px-4 text-sm">
                    {!!archives.length && (
                      <ul className="pb-4 grid grid-cols-1 gap-4 mb-4">
                        {searchText.length
                          ? archives
                              .filter((o) =>
                                makeTimestamp(o.name).includes(searchText)
                              )
                              .map(renderArchiveItem)
                          : archives.map(renderArchiveItem)}
                        {!!searchText.length &&
                          archives.filter((o) =>
                            makeTimestamp(o.name).includes(searchText)
                          ).length === 0 && (
                            <p className="text-center">No results found</p>
                          )}
                      </ul>
                    )}

                    {!archives.length && (
                      <p className="text-center text-gray-400">
                        You have no recent archives
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

export default Archives;
