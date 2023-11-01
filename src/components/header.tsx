import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import DarkModeToggle from "./dark-mode";

import SearchBox from "./search-box";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState<boolean | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <header className="flex justify-between bg-[#5EAD43] p-4">
      <div className="flex items-center md:hidden z-5">
        <SearchBox isMobile={true} />
      </div>
      <Logo />
      <div className="flex justify-between items-center md:hidden">
        <HamburgerButton menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      </div>
      <div className="flex justify-between items-center">
        <DesktopNav />
        {menuOpen && <MobileNav menuRef={menuRef} setMenuOpen={setMenuOpen} />}
      </div>
    </header>
  );
}

function Logo() {
  return (
    <div className="text-xl font-bold mx-auto md:mx-0">
      <Link href="/" className="text-white">
        <p>Yomogy</p>
        {/* // svgに変更予定
        <svg></svg> 
        */}
      </Link>
    </div>
  );
}

function DesktopNav() {
  return (
    <nav className="hidden md:flex gap-4 items-center">
      <Link href="/igem/page/1" className="text-white">
        iGEM
      </Link>
      <Link href="/synbio/page/1" className="text-white">
        Synbio
      </Link>
      <DarkModeToggle />
      <SearchBox isMobile={false} />
    </nav>
  );
}

type HamburgerButtonProps = {
  menuOpen: boolean | null;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean | null>>;
};

function HamburgerButton({ menuOpen, setMenuOpen }: HamburgerButtonProps) {
  return (
    <button
      className="flex items-center"
      onClick={() => setMenuOpen(!menuOpen)}
    >
      <svg
        width="24"
        height="24"
        className="h-6 w-6"
        viewBox="0 0 24 24"
        fill="white"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4 5C4 4.44772 4.44772 4 5 4H19C19.5523 4 20 4.44772 20 5C20 5.55228 19.5523 6 19 6H5C4.44772 6 4 5.55228 4 5ZM4 12C4 11.4477 4.44772 11 5 11H19C19.5523 11 20 11.4477 20 12C20 12.5523 19.5523 13 19 13H5C4.44772 13 4 12.5523 4 12ZM5 18C4.44772 18 4 18.4477 4 19C4 19.5523 4.44772 20 5 20H19C19.5523 20 20 19.5523 20 19C20 18.4477 19.5523 18 19 18H5Z"
        />
      </svg>
    </button>
  );
}

type MobileNavProps = {
  menuRef: React.RefObject<HTMLDivElement>;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean | null>>;
};

function MobileNav({ menuRef, setMenuOpen }: MobileNavProps) {
  return (
    <nav
      ref={menuRef}
      className="fixed top-0 right-0 z-10 h-full w-64 p-4 bg-white dark:bg-gray-800 transition-transform transform"
    >
      <div className="mb-4">
        <DarkModeToggle />
      </div>

      <div className="mb-4">
        <Link
          href="/igem/page/1"
          className="text-gray-800 dark:text-white block py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={() => setMenuOpen(false)} // この行を追加
        >
          iGEM
        </Link>
      </div>
      <div className="mb-4">
        <Link
          href="/synbio/page/1"
          className="text-gray-800 dark:text-white block py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={() => setMenuOpen(false)}
        >
          Synbio
        </Link>
      </div>
    </nav>
  );
}
