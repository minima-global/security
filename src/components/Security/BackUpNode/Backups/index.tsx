import React, { useContext, useEffect, useState } from "react";
import styles from "./List.module.css";
import Input from "../../../UI/Input";
import { appContext } from "../../../../AppContext";
import { useAuth } from "../../../../providers/authProvider";
import * as fileManager from "../../../../__minima__/libs/fileManager";
import AsyncLink from "../../../UI/AsyncLink";
import PERMISSIONS from "../../../../permissions";
import useIsMinimaBrowser from "../../../../hooks/useIsMinimaBrowser";

const Backups = () => {
  const [searchText, setSearchText] = useState("");
  const { getBackups, backups } = useContext(appContext);
  const { authNavigate } = useAuth();
  const isMinimaBrowser = useIsMinimaBrowser();

  useEffect(() => {
    getBackups();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleDownload = async (backupFile: string) => {
    if (window.navigator.userAgent.includes("Minima Browser")) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return Android.fileDownload(MDS.minidappuid, backupFile);
    }
  };

  const handleDelete = async (backupFile: string) => {
    authNavigate(
      "/dashboard/backup/backups/delete",
      PERMISSIONS.CAN_VIEW_DELETE_BACKUP,
      {
        state: { backup: { name: backupFile } },
      }
    );
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
                extraClass="rounded-r-none"
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
                        {!!isMinimaBrowser && (
                          <svg
                            onClick={async () => {
                              const fullPath = await fileManager.getPath(
                                "/backups/" + b.name
                              );

                              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                              // @ts-ignore
                              Android.shareFile(fullPath, "*/*");
                            }}
                            xmlns="http://www.w3.org/2000/svg"
                            height="48"
                            viewBox="0 -960 960 960"
                            width="48"
                            fill="#D9D9D9"
                          >
                            <path
                              fill="#D9D9D9"
                              d="M727-80q-47.5 0-80.75-33.346Q613-146.693 613-194.331q0-6.669 1.5-16.312T619-228L316-404q-15 17-37 27.5T234-366q-47.5 0-80.75-33.25T120-480q0-47.5 33.25-80.75T234-594q23 0 44 9t38 26l303-174q-3-7.071-4.5-15.911Q613-757.75 613-766q0-47.5 33.25-80.75T727-880q47.5 0 80.75 33.25T841-766q0 47.5-33.25 80.75T727-652q-23.354 0-44.677-7.5T646-684L343-516q2 8 3.5 18.5t1.5 17.741q0 7.242-1.5 15Q345-457 343-449l303 172q15-14 35-22.5t46-8.5q47.5 0 80.75 33.25T841-194q0 47.5-33.25 80.75T727-80Zm.035-632Q750-712 765.5-727.535q15.5-15.535 15.5-38.5T765.465-804.5q-15.535-15.5-38.5-15.5T688.5-804.465q-15.5 15.535-15.5 38.5t15.535 38.465q15.535 15.5 38.5 15.5Zm-493 286Q257-426 272.5-441.535q15.5-15.535 15.5-38.5T272.465-518.5q-15.535-15.5-38.5-15.5T195.5-518.465q-15.5 15.535-15.5 38.5t15.535 38.465q15.535 15.5 38.5 15.5Zm493 286Q750-140 765.5-155.535q15.5-15.535 15.5-38.5T765.465-232.5q-15.535-15.5-38.5-15.5T688.5-232.465q-15.5 15.535-15.5 38.5t15.535 38.465q15.535 15.5 38.5 15.5ZM727-766ZM234-480Zm493 286Z"
                            />
                          </svg>
                        )}

                        <AsyncLink
                          folder="backups"
                          file={b.name}
                          onClick={(e) => {
                            if (isMinimaBrowser) {
                              e.stopPropagation();
                              handleDownload("/backups/" + b.name);
                            }
                          }}
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
                      {!!isMinimaBrowser && (
                        <svg
                          onClick={async () => {
                            const fullPath = await fileManager.getPath(
                              "/backups/" + b.name
                            );

                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            Android.shareFile(fullPath, "*/*");
                          }}
                          xmlns="http://www.w3.org/2000/svg"
                          height="20"
                          viewBox="0 -960 960 960"
                          width="20"
                          fill="#17191C"
                        >
                          <path
                            fill="#17191C"
                            d="M727-80q-47.5 0-80.75-33.346Q613-146.693 613-194.331q0-6.669 1.5-16.312T619-228L316-404q-15 17-37 27.5T234-366q-47.5 0-80.75-33.25T120-480q0-47.5 33.25-80.75T234-594q23 0 44 9t38 26l303-174q-3-7.071-4.5-15.911Q613-757.75 613-766q0-47.5 33.25-80.75T727-880q47.5 0 80.75 33.25T841-766q0 47.5-33.25 80.75T727-652q-23.354 0-44.677-7.5T646-684L343-516q2 8 3.5 18.5t1.5 17.741q0 7.242-1.5 15Q345-457 343-449l303 172q15-14 35-22.5t46-8.5q47.5 0 80.75 33.25T841-194q0 47.5-33.25 80.75T727-80Zm.035-632Q750-712 765.5-727.535q15.5-15.535 15.5-38.5T765.465-804.5q-15.535-15.5-38.5-15.5T688.5-804.465q-15.5 15.535-15.5 38.5t15.535 38.465q15.535 15.5 38.5 15.5Zm-493 286Q257-426 272.5-441.535q15.5-15.535 15.5-38.5T272.465-518.5q-15.535-15.5-38.5-15.5T195.5-518.465q-15.5 15.535-15.5 38.5t15.535 38.465q15.535 15.5 38.5 15.5Zm493 286Q750-140 765.5-155.535q15.5-15.535 15.5-38.5T765.465-232.5q-15.535-15.5-38.5-15.5T688.5-232.465q-15.5 15.535-15.5 38.5t15.535 38.465q15.535 15.5 38.5 15.5ZM727-766ZM234-480Zm493 286Z"
                          />
                        </svg>
                      )}
                      <AsyncLink
                        folder="backups"
                        file={b.name}
                        onClick={(e) => {
                          if (isMinimaBrowser) {
                            e.stopPropagation();
                            handleDownload("/backups/" + b.name);
                          }
                        }}
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
                extraClass="rounded-r-none"
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
    // <SlideUp delay={100}>

    // </SlideUp>
  );
};

export default Backups;
