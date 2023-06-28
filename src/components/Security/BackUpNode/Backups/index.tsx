import React, { useContext, useEffect, useState } from "react";
import styles from "./List.module.css";
import Input from "../../../UI/Input";
import { appContext } from "../../../../AppContext";
import { useAuth } from "../../../../providers/authProvider";
import * as fileManager from "../../../../__minima__/libs/fileManager";
import AsyncLink from "../../../UI/AsyncLink";
import PERMISSIONS from "../../../../permissions";
import Button from "../../../UI/Button";

const Backups = () => {
  const [searchText, setSearchText] = useState("");
  const { getBackups, backups, isMinimaBrowser, setModal } =
    useContext(appContext);
  const { authNavigate } = useAuth();

  useEffect(() => {
    getBackups();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const getFileData = async (mdsfile: string) => {
    try {
      const hexstring = await fileManager.loadBinaryToHex(mdsfile);
      const filedata = hexstring;

      return filedata;
    } catch (error) {
      return "";
    }
  };

  const handleDownload = async (backupFile: string) => {
    if (isMinimaBrowser) {
      const filedata = await getFileData("/backups/" + backupFile);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return Android.blobDownload(backupFile, filedata);
    }
  };

  const handleDelete = async (backupFile: string) => {
    authNavigate("/dashboard/modal", PERMISSIONS.CAN_VIEW_MODAL);
    setModal({
      content: (
        <div>
          <svg
            className="inline mb-2"
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="65"
            viewBox="0 0 64 65"
            fill="none"
          >
            <g id="delete">
              <mask
                id="mask0_1422_18346"
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="64"
                height="65"
              >
                <rect
                  id="Bounding box"
                  y="0.5"
                  width="64"
                  height="64"
                  fill="#D9D9D9"
                />
              </mask>
              <g mask="url(#mask0_1422_18346)">
                <path
                  id="delete_2"
                  d="M20.3083 53.8333C19.081 53.8333 18.0562 53.4222 17.234 52.6C16.4118 51.7778 16.0007 50.753 16.0007 49.5257V16.5H13.334V13.8333H24.0007V11.782H40.0006V13.8333H50.6673V16.5H48.0006V49.5257C48.0006 50.753 47.5895 51.7778 46.7673 52.6C45.9451 53.4222 44.9203 53.8333 43.693 53.8333H20.3083ZM26.1545 45.8333H28.8212V21.8333H26.1545V45.8333ZM35.1801 45.8333H37.8468V21.8333H35.1801V45.8333Z"
                  fill="#F9F9FA"
                />
              </g>
            </g>
          </svg>
          <h1 className="text-2xl mb-1">Delete this backup?</h1>
          <p className="text-xl mb-9 text-core-grey-80 ">{backupFile}</p>
        </div>
      ),
      primaryActions: (
        <Button
          onClick={async () => {
            await fileManager.deleteFile("/backups/" + backupFile);
            getBackups();
            authNavigate("/dashboard/backup/backups", []);
          }}
        >
          Delete backup
        </Button>
      ),
      secondaryActions: (
        <Button onClick={() => authNavigate("/dashboard/backup/backups", [])}>
          Cancel
        </Button>
      ),
    });
  };

  return (
    <div className={styles["backdrop"]}>
      <div className={styles["dd"]}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl">Recent backups</h1>
          <svg
            onClick={() => authNavigate("/dashboard/backup", [])}
            width="16"
            height="17"
            viewBox="0 0 16 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.23077 16.5L0 15.2692L6.76923 8.5C4.12568 5.85645 2.64355 4.37432 0 1.73077L1.23077 0.5L8 7.26923L14.7692 0.5L16 1.73077L9.23077 8.5L16 15.2692L14.7692 16.5L8 9.73077L1.23077 16.5Z"
              fill="#F9F9FA"
            />
          </svg>
        </div>

        {!!backups.length && (
          <>
            <div className="mb-6">
              <Input
                id="search"
                name="search"
                type="text"
                placeholder="Search backups"
                onChange={handleChange}
                extraClass="core-black-contrast rounded-r-none"
                endIcon={
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16.3913 8.69565C16.3913 12.9458 12.9459 16.3913 8.69566 16.3913C4.44546 16.3913 1 12.9458 1 8.69565C1 4.44546 4.44546 1 8.69566 1C12.9459 1 16.3913 4.44546 16.3913 8.69565Z"
                      stroke="#BDBDC4"
                      strokeWidth="2"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M19 19L15 15"
                      stroke="#BDBDC4"
                      strokeWidth="2"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
              />
            </div>
            <ul className="pb-4">
              {!!searchText.length &&
                backups
                  .filter((o) => o.name.includes(searchText))
                  .map((b, i) => (
                    <li
                      className="font-normal p-4 core-grey-5 rounded color-black"
                      key={i}
                    >
                      <p className="font-medium break-all">{b.name}</p>

                      <div className="flex items-center gap-3">
                        <AsyncLink
                          file={"/backups/" + b.name}
                          name={b.name}
                          onClick={() => handleDownload("/backups/" + b.name)}
                        >
                          <svg
                            onClick={() => handleDownload(backups.name)}
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <g id="download">
                              <mask
                                id="mask0_1422_18404"
                                maskUnits="userSpaceOnUse"
                                x="0"
                                y="0"
                                width="24"
                                height="24"
                              >
                                <rect
                                  id="Bounding box"
                                  width="24"
                                  height="24"
                                  fill="#D9D9D9"
                                />
                              </mask>
                              <g mask="url(#mask0_1422_18404)">
                                <path
                                  id="download_2"
                                  d="M5.92822 20C5.38941 20 4.93334 19.8155 4.56 19.4464C4.18667 19.0773 4 18.6264 4 18.0938V15.2548H5.59998V18.0938C5.59998 18.1749 5.63417 18.2493 5.70254 18.3169C5.77093 18.3845 5.84616 18.4183 5.92822 18.4183H18.0718C18.1538 18.4183 18.2291 18.3845 18.2975 18.3169C18.3658 18.2493 18.4 18.1749 18.4 18.0938V15.2548H20V18.0938C20 18.6264 19.8133 19.0773 19.44 19.4464C19.0667 19.8155 18.6106 20 18.0718 20H5.92822ZM12 15.9037L7.4462 11.4018L8.57028 10.2581L11.2 12.8579V4H12.8V12.8579L15.4297 10.2581L16.5538 11.4018L12 15.9037Z"
                                  fill="#17191C"
                                />
                              </g>
                            </g>
                          </svg>
                        </AsyncLink>

                        <svg
                          onClick={() => handleDelete(b.name)}
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <g id="delete">
                            <mask
                              id="mask0_1422_18407"
                              maskUnits="userSpaceOnUse"
                              x="0"
                              y="0"
                              width="24"
                              height="24"
                            >
                              <rect
                                id="Bounding box"
                                width="24"
                                height="24"
                                fill="#D9D9D9"
                              />
                            </mask>
                            <g mask="url(#mask0_1422_18407)">
                              <path
                                id="delete_2"
                                d="M6.99489 21C6.46292 21 6.00857 20.8117 5.63182 20.4352C5.25505 20.0586 5.06667 19.6045 5.06667 19.0729V5.54211H4V3.94304H8.79999V3H15.2V3.94304H20V5.54211H18.9333V19.0729C18.9333 19.6114 18.7467 20.0672 18.3733 20.4403C18 20.8134 17.5439 21 17.0051 21H6.99489ZM17.3334 5.54211H6.66665V19.0729C6.66665 19.1686 6.69742 19.2472 6.75897 19.3087C6.82052 19.3702 6.89916 19.4009 6.99489 19.4009H17.0051C17.0872 19.4009 17.1624 19.3668 17.2308 19.2984C17.2992 19.2301 17.3334 19.1549 17.3334 19.0729V5.54211ZM9.23079 17.2688H10.8308V7.67424H9.23079V17.2688ZM13.1692 17.2688H14.7692V7.67424H13.1692V17.2688Z"
                                fill="#EA1137"
                              />
                            </g>
                          </g>
                        </svg>
                      </div>
                    </li>
                  ))}
              {!searchText.length &&
                backups.map((b, i) => (
                  <li
                    className="font-normal p-4 core-grey-5 rounded color-black"
                    key={i}
                  >
                    <p className="font-medium break-all">{b.name}</p>

                    <div className="flex items-center gap-3">
                      <AsyncLink
                        file={"/backups/" + b.name}
                        name={b.name}
                        onClick={() => handleDownload("/backups/" + b.name)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <g id="download">
                            <mask
                              id="mask0_1422_18404"
                              maskUnits="userSpaceOnUse"
                              x="0"
                              y="0"
                              width="24"
                              height="24"
                            >
                              <rect
                                id="Bounding box"
                                width="24"
                                height="24"
                                fill="#D9D9D9"
                              />
                            </mask>
                            <g mask="url(#mask0_1422_18404)">
                              <path
                                id="download_2"
                                d="M5.92822 20C5.38941 20 4.93334 19.8155 4.56 19.4464C4.18667 19.0773 4 18.6264 4 18.0938V15.2548H5.59998V18.0938C5.59998 18.1749 5.63417 18.2493 5.70254 18.3169C5.77093 18.3845 5.84616 18.4183 5.92822 18.4183H18.0718C18.1538 18.4183 18.2291 18.3845 18.2975 18.3169C18.3658 18.2493 18.4 18.1749 18.4 18.0938V15.2548H20V18.0938C20 18.6264 19.8133 19.0773 19.44 19.4464C19.0667 19.8155 18.6106 20 18.0718 20H5.92822ZM12 15.9037L7.4462 11.4018L8.57028 10.2581L11.2 12.8579V4H12.8V12.8579L15.4297 10.2581L16.5538 11.4018L12 15.9037Z"
                                fill="#17191C"
                              />
                            </g>
                          </g>
                        </svg>
                      </AsyncLink>

                      <svg
                        onClick={() => handleDelete(b.name)}
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <g id="delete">
                          <mask
                            id="mask0_1422_18407"
                            maskUnits="userSpaceOnUse"
                            x="0"
                            y="0"
                            width="24"
                            height="24"
                          >
                            <rect
                              id="Bounding box"
                              width="24"
                              height="24"
                              fill="#D9D9D9"
                            />
                          </mask>
                          <g mask="url(#mask0_1422_18407)">
                            <path
                              id="delete_2"
                              d="M6.99489 21C6.46292 21 6.00857 20.8117 5.63182 20.4352C5.25505 20.0586 5.06667 19.6045 5.06667 19.0729V5.54211H4V3.94304H8.79999V3H15.2V3.94304H20V5.54211H18.9333V19.0729C18.9333 19.6114 18.7467 20.0672 18.3733 20.4403C18 20.8134 17.5439 21 17.0051 21H6.99489ZM17.3334 5.54211H6.66665V19.0729C6.66665 19.1686 6.69742 19.2472 6.75897 19.3087C6.82052 19.3702 6.89916 19.4009 6.99489 19.4009H17.0051C17.0872 19.4009 17.1624 19.3668 17.2308 19.2984C17.2992 19.2301 17.3334 19.1549 17.3334 19.0729V5.54211ZM9.23079 17.2688H10.8308V7.67424H9.23079V17.2688ZM13.1692 17.2688H14.7692V7.67424H13.1692V17.2688Z"
                              fill="#EA1137"
                            />
                          </g>
                        </g>
                      </svg>
                    </div>
                  </li>
                ))}
              {!!searchText.length &&
                backups.filter((o) => o.name.includes(searchText)).length ===
                  0 && <p className={styles["no-results"]}>No results found</p>}
            </ul>
          </>
        )}
        {!backups.length && (
          <>
            <div className="mb-6">
              <Input
                id="search"
                name="search"
                type="text"
                placeholder="Search backups"
                onChange={handleChange}
                extraClass="core-black-contrast rounded-r-none"
                endIcon={
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16.3913 8.69565C16.3913 12.9458 12.9459 16.3913 8.69566 16.3913C4.44546 16.3913 1 12.9458 1 8.69565C1 4.44546 4.44546 1 8.69566 1C12.9459 1 16.3913 4.44546 16.3913 8.69565Z"
                      stroke="#BDBDC4"
                      strokeWidth="2"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M19 19L15 15"
                      stroke="#BDBDC4"
                      strokeWidth="2"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
              />
            </div>
            <p className={styles["no-results"]}>You have no recent backups</p>
          </>
        )}
      </div>
    </div>
  );
};

export default Backups;
