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
  disabled?: boolean;
}
const List = ({ options, setForm, disabled }: IProps) => {
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
    setSearchText("");
  };

  useEffect(() => {
    if (selected === "") {
      handleSelect(options.length ? options[0].name : "No backups available");
      setForm(options.length ? options[0].name : "");
    }
  }, [options]);

  return (
    <div className={`${styles.layout} core-grey-20`}>
      <div
        onClick={() => {
          if (!disabled) {
            options.length ? setModal((prevState) => !prevState) : null;
          }
        }}
        className={`${styles.picker} hover:cursor-pointer hover:bg-slate-200`}
      >
        <span className="color-black font-sm">{selected}</span>
        {!disabled && (
          <svg
            className={openModal ? styles.active : ""}
            width="16"
            height="10"
            viewBox="0 0 16 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.0004 9.06678L0.466797 1.50038L1.6668 0.333984L8.0004 6.66678L14.334 0.333984L15.534 1.53398L8.0004 9.06678Z"
              fill="#91919D"
            />
          </svg>
        )}
      </div>
      {openModal && (
        <>
          <div className={styles["backdrop"]}>
            <div className={styles["dd"]}>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl">Choose a file</h1>
                <svg
                  className="hover:cursor-pointer"
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
                      disabled={false}
                      id="search"
                      name="search"
                      type="text"
                      placeholder="Search files"
                      onChange={handleChange}
                      extraClass="core-black-contrast-2 rounded-r-none"
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
                            className="font-normal p-4 core-grey-5 rounded color-black grid grid-cols-[1fr,auto] grid-rows-1 gap-2 items-center"
                            key={i}
                            onClick={() => handleSelect(b.name)}
                          >
                            <h1 className="font-medium text-sm break-all">
                              {b.name}
                            </h1>

                            <p className="text-sm font-medium text-right grid">
                              {formatBytes(b.size)}
                            </p>
                          </li>
                        ))}
                    {!searchText.length &&
                      options.map((b, i) => (
                        <li
                          className="font-normal p-4 core-grey-5 rounded color-black grid grid-cols-[1fr,auto] grid-rows-1 gap-2 items-center"
                          key={i}
                          onClick={() => handleSelect(b.name)}
                        >
                          <h1 className="font-medium text-sm break-all">
                            {b.name}
                          </h1>

                          <p className="text-sm font-medium text-right grid">
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
                <p className={styles["no-results"]}>No file found</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default List;
