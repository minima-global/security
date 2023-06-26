import React, { useEffect, useState } from "react";
import styles from "./List.module.css";
import Input from "../Input";

function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = [
    "Bytes",
    "KiB",
    "MiB",
    "GiB",
    "TiB",
    "PiB",
    "EiB",
    "ZiB",
    "YiB",
  ];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

interface IProps {
  options: any[];
  setForm: (o: string) => void;
}
const List = ({ options, setForm }: IProps) => {
  const [selected, setSelected] = useState("");
  const [openModal, setModal] = useState(false);
  const [searchText, setSearchText] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleSelect = (backup: string) => {
    setSelected(backup);
    setModal(false);
    setForm(backup);
  };

  useEffect(() => {
    // select the latest backup..
    handleSelect(options.length ? options[0].name : "No backups available");
  }, []);

  return (
    <div className={`${styles.layout} core-grey-20`}>
      <div
        onClick={() =>
          options.length ? setModal((prevState) => !prevState) : null
        }
        className={styles["picker"]}
      >
        <span className="color-black font-medium">{selected}</span>
        <img
          className={openModal ? styles.active : ""}
          alt="arrow-d"
          src="./assets/expand_more.svg"
        />
      </div>
      {openModal && (
        <>
          <div className={styles["backdrop"]}>
            <div className={styles["dd"]}>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl">Choose a backup file</h1>
                <svg
                  onClick={() => setModal(false)}
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

              {!!options.length && (
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
                      options
                        .filter((o) => o.name.includes(searchText))
                        .map((b, i) => (
                          <li
                            className="font-normal p-4 core-grey-5 rounded color-black flex justify-between gap-2 items-center"
                            key={i}
                            onClick={() => handleSelect(b.name)}
                          >
                            <div className="flex items-center gap-4">
                              <svg
                                className="inline w-6 h-6"
                                xmlns="http://www.w3.org/2000/svg"
                                height="48"
                                viewBox="0 -960 960 960"
                                width="48"
                              >
                                <path d="M298-260q-91.164 0-154.582-64.5Q80-389 80-480t62.5-155.5Q205-700 296-700h430q63.525 0 108.763 45.544Q880-608.911 880-544.956 880-481 834.763-435.5 789.525-390 726-390H331q-38.22 0-64.61-26.141t-26.39-64Q240-518 267.5-544t65.5-26h393v40H332q-21 0-36.5 14.325-15.5 14.324-15.5 35.5Q280-459 295-444.5q15 14.5 36 14.5h395q47.88 0 80.94-33.289 33.06-33.288 33.06-81.5Q840-593 806.94-626.5T726-660H294q-73 0-123.5 52.875T120-480q0 75 51.5 127.5T297-300h429v40H298Z" />
                              </svg>
                              <p className="font-medium">{b.name}</p>
                            </div>
                            <p className="float-right text-sm font-medium">
                              {formatBytes(b.size)}
                            </p>
                          </li>
                        ))}
                    {!searchText.length &&
                      options.map((b, i) => (
                        <li
                          className="font-normal p-4 core-grey-5 rounded color-black flex justify-between gap-2 items-center"
                          key={i}
                          onClick={() => handleSelect(b.name)}
                        >
                          <div className="flex items-center gap-4">
                            <svg
                              className="inline w-6 h-6"
                              xmlns="http://www.w3.org/2000/svg"
                              height="48"
                              viewBox="0 -960 960 960"
                              width="48"
                            >
                              <path d="M298-260q-91.164 0-154.582-64.5Q80-389 80-480t62.5-155.5Q205-700 296-700h430q63.525 0 108.763 45.544Q880-608.911 880-544.956 880-481 834.763-435.5 789.525-390 726-390H331q-38.22 0-64.61-26.141t-26.39-64Q240-518 267.5-544t65.5-26h393v40H332q-21 0-36.5 14.325-15.5 14.324-15.5 35.5Q280-459 295-444.5q15 14.5 36 14.5h395q47.88 0 80.94-33.289 33.06-33.288 33.06-81.5Q840-593 806.94-626.5T726-660H294q-73 0-123.5 52.875T120-480q0 75 51.5 127.5T297-300h429v40H298Z" />
                            </svg>
                            <p className="font-medium">{b.name}</p>
                          </div>
                          <p className="float-right text-sm font-medium">
                            {formatBytes(b.size)}
                          </p>
                        </li>
                      ))}
                    {!!searchText.length &&
                      options.filter((o) => o.name.includes(searchText))
                        .length === 0 && (
                        <p className={styles["no-results"]}>No results found</p>
                      )}
                  </ul>
                </>
              )}
              {!options.length && (
                <p className={styles["no-results"]}>No backups founds</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default List;
