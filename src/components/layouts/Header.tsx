import { Icons } from "@/components/Icons";
import Link from "next/link";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 0;
      setIsScrolled(isScrolled);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      aria-label="header"
      className={twMerge(
        "fixed top-0 left-0 z-20 flex w-full items-center gap-4",
        isScrolled
          ? "bg-gray-900/20 backdrop-blur-sm backdrop-filter"
          : "bg-transparent"
      )}
    >
      <nav className="container flex max-w-6xl items-center justify-between px-4 py-4">
        <Link
          aria-label="navigate to home page"
          href="/"
          className="flex items-center gap-2 text-white transition-colors hover:text-gray-100"
        >
          <Icons.logo className="h-6 w-6" aria-hidden="true" />
          <span className="text-xl font-medium">Cronbase</span>
        </Link>
        <a
          aria-label="navigate to github repo"
          href="https://github.com/sadmann7/cronbase"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-full bg-violet-600 px-2 py-2 text-base transition-colors hover:bg-violet-700 active:scale-95 xxs:px-4"
        >
          <Icons.gitHub className="h-5 w-5" aria-hidden="true" />
          <span className="sr-only text-xs text-gray-100 xxs:not-sr-only sm:text-sm">
            Star on Github
          </span>
        </a>
      </nav>
    </header>
  );
};

export default Header;
