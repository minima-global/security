import { useEffect, useRef, useState } from "react";

interface IProps {
  placeholder: string;
  type: string;
  value?: any;
  name: string;
  id: string;
  suggestions: string[];
  setSuggestion?: any;
  autoComplete?: string;
  extraClass?: string;
  accept?: string;
  onChange?: any;
  onBlur?: any;
  showPassword?: boolean;
  endIcon?: any;
  startIcon?: any;
  error?: string | false;
  onKeyUp?: any;
  handleEndIconClick?: () => void;
  disabled: boolean;
  mt?: string;
  mb?: string;
  onPaste?: (event: React.ClipboardEvent<HTMLInputElement>) => void;
}
const Autocomplete = ({
  accept,
  onChange,
  onBlur,
  placeholder,
  autoComplete,
  type,
  name,
  id,
  extraClass,
  value,
  endIcon,
  startIcon,
  error,
  handleEndIconClick,
  onKeyUp,
  disabled,
  mt,
  mb,
  suggestions,
  onPaste,
}: IProps) => {
  // Ref for the suggestions container
  const suggestionsContainerRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

  const wrapperBase = `${mt} ${mb} ${
    startIcon ? "grid grid-cols-[1fr_auto] grid-rows-1" : "flex"
  }`;

  let base = `core-black-contrast-2 w-full px-4 py-3.5 ${
    filteredSuggestions.length > 0 ? "rounded-t" : "rounded"
  } disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:border-[#fff] border-[#fff] focus:border-[#464C4F]`;

  if (extraClass) {
    base += ` ${extraClass}`;
  }

  const handleKeyDown = (event) => {
    switch (event.key) {
      case "ArrowDown":
        setFilteredSuggestions(
          suggestions!.filter((s) => s.startsWith(value.toUpperCase()))
        );
        // Move selection down
        setSelectedIndex((prevIndex) =>
          Math.min(prevIndex + 1, filteredSuggestions.length - 1)
        );
        break;
      case "ArrowUp":
        if (selectedIndex === 0) {
          setFilteredSuggestions([]);
        }
        // Move selection up
        setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
        break;
      case "Enter":        
        // Handle selection (e.g., set input value)
        if (selectedIndex !== -1 && filteredSuggestions[selectedIndex]) {
          onChange(filteredSuggestions[selectedIndex]);
          setFilteredSuggestions([]);
        }
        break;
      case "Tab":
        // If hasn't highlighted any, prevent default behavior, highlight first
        if (selectedIndex === -1) {
          setSelectedIndex(0);
          event.preventDefault();
        }
        // If highlighted then select that..
        if (selectedIndex !== -1 && filteredSuggestions[selectedIndex]) {
          onChange(filteredSuggestions[selectedIndex]);
          setFilteredSuggestions([]);
        }

        break;
      case "Escape":
        setFilteredSuggestions([]);
        break;
      default:
        break;
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    onChange(value);

    if (value.length === 0) {
      return setFilteredSuggestions([]);
    }

    const filtered = suggestions!.filter((s) =>
      s.startsWith(value.toUpperCase())
    );
    setFilteredSuggestions(filtered);
  };

  const handleSelect = (suggestion: string) => {
    onChange(suggestion);
    setFilteredSuggestions([]);
  };

  // scroll into view while pressing key down
  useEffect(() => {
    // Scroll the selected suggestion into view when selectedIndex changes
    if (suggestionsContainerRef.current && selectedIndex !== -1) {
      const selectedSuggestion =
        // @ts-ignore
        suggestionsContainerRef.current.children[selectedIndex];
      if (selectedSuggestion) {
        selectedSuggestion.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }, [selectedIndex]);

  // Effect to add a click event listener to the document
  useEffect(() => {
    const handleDocumentClick = (event) => {
      // Check if the click is outside the input and suggestions container
      if (
        suggestionsContainerRef.current &&
        // @ts-ignore
        !suggestionsContainerRef.current.contains(event.target)
      ) {
        setFilteredSuggestions([]);
      }
    };

    // Add the event listener
    document.addEventListener("click", handleDocumentClick);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  return (
    <div className={`flex flex-col gap-2`}>
      <div className={`${wrapperBase}`}>
        <div className="relative w-full">
          <input
            onPaste={onPaste}
            disabled={disabled}
            onKeyDown={handleKeyDown}
            autoComplete={autoComplete ? autoComplete : "off"}
            onBlur={onBlur}
            name={name}
            id={id}
            value={value}
            type={type}
            placeholder={placeholder}
            className={`${base} ${startIcon ? "pl-10" : ""} ${
              endIcon ? "pr-12" : ""
            }`}
            onChange={handleInputChange}
            accept={accept}
            onKeyUp={onKeyUp}
          />
          {filteredSuggestions.length > 0 && (
            <ul
              ref={suggestionsContainerRef}
              id={`autocomplete_list_${id}`}
              className={`max-h-[150px] scroll overflow-y-auto absolute top-[100%] z-[1000] w-full bg-white px-0 rounded-b-lg animate-fadeIn`}
            >
              {filteredSuggestions
                .filter((s) => s.startsWith(value.toUpperCase()))
                .map((s, index) => (
                  <li
                    key={`word_${s}`}
                    onClick={() => {
                      handleSelect(s);
                    }}
                    className={`${
                      selectedIndex === index ? "bg-slate-200" : ""
                    } first:pb-2 last:border-b-none! hover:cursor-pointer hover:bg-slate-200 hover:font-semibold ${
                      startIcon
                        ? "grid grid-cols-[32px_auto] grid-rows-1"
                        : "flex"
                    }  px-2 pt-2 text-black font-light ${
                      filteredSuggestions.length > 1 ? "border-b pb-2" : ""
                    }`}
                  >
                    <span />
                    {s}
                  </li>
                ))}
            </ul>
          )}
          {startIcon}

          {!!endIcon && (
            <div
              onClick={disabled ? undefined : handleEndIconClick}
              className="pr-4 my-auto absolute right-[1px] top-4 bottom-0"
            >
              {endIcon}
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="text-sm form-error-message text-left">{error}</div>
      )}
    </div>
  );
};

export default Autocomplete;
