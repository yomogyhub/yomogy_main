import React, { useState, useEffect, useRef, MouseEvent } from "react";

interface SearchBoxProps {
  isMobile: boolean;
}

const SearchBox: React.FC<SearchBoxProps> = ({ isMobile }) => {
  if (isMobile) {
    return <MobileSearchBox />;
  } else {
    return <DesktopSearchBox />;
  }
};

const MobileSearchBox = () => {
  const [isInputVisible, setInputVisibility] = useState<boolean>(false);
  const [svgColor, setSvgColor] = useState<string>("white");
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(event: globalThis.MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setInputVisibility(false);
        setSvgColor("white");
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
    setInputVisibility(!isInputVisible);
    setSvgColor(isInputVisible ? "white" : "rgb(151, 151, 151)");
  };

  return (
    <div className="relative flex items-center h-8" ref={searchRef}>
      {isInputVisible && (
        <div
          className="absolute top-0 left-0 pr-5 h-8 flex items-center z-10"
          style={{ width: "97vw" }}
        >
          <SearchForm />
        </div>
      )}
      <SearchButton onClick={handleButtonClick} color={svgColor} />
    </div>
  );
};

const DesktopSearchBox = () => {
  return (
    <div className="bg-gray-200 rounded-full h-8 pr-1 flex items-center">
      <SearchForm />
    </div>
  );
};

const SearchForm = () => (
  <form
    action="/search"
    method="get"
    className="flex items-center bg-gray-200 w-full rounded-full"
  >
    <SearchButton type="submit" color="rgb(151, 151, 151)" />
    <input
      className=" h-6 border-none outline-none bg-gray-200 py-1 rounded-full"
      type="search"
      name="q"
      placeholder="サイトを検索"
      style={{ color: "black", caretColor: "black", width: "82%" }}
    />
  </form>
);

interface SearchButtonProps {
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit";
  color: string;
}

const SearchButton: React.FC<SearchButtonProps> = ({
  onClick,
  type = "button",
  color,
}) => (
  <button
    type={type}
    className="h-5 ml-2 mr-1 p-0 border-none bg-transparent"
    onClick={onClick}
  >
    <SearchIcon color={color} />
  </button>
);

interface SearchIconProps {
  color: string;
}

const SearchIcon: React.FC<SearchIconProps> = ({ color }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 512 512"
    fill={color}
  >
    <path d="M495.272,423.558c0,0-68.542-59.952-84.937-76.328c-24.063-23.938-33.69-35.466-25.195-54.931   c37.155-75.78,24.303-169.854-38.72-232.858c-79.235-79.254-207.739-79.254-286.984,0c-79.245,79.264-79.245,207.729,0,287.003   c62.985,62.985,157.088,75.837,232.839,38.691c19.466-8.485,31.022,1.142,54.951,25.215c16.384,16.385,76.308,84.937,76.308,84.937   c31.089,31.071,55.009,11.95,69.368-2.39C507.232,478.547,526.362,454.638,495.272,423.558z M286.017,286.012   c-45.9,45.871-120.288,45.871-166.169,0c-45.88-45.871-45.88-120.278,0-166.149c45.881-45.871,120.269-45.871,166.169,0   C331.898,165.734,331.898,240.141,286.017,286.012z" />
  </svg>
);

export default SearchBox;
