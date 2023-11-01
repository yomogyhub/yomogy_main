import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer flex justify-between  bg-[#5EAD43]  p-4 text-white">
      <div className="flex-1">
        <h2>About</h2>
        <Link href="/administrator">
          <p>運営者</p>
        </Link>
        <Link href="/contact">
          <p>Contact</p>
        </Link>
      </div>
      <div className="flex-1">
        <h2>Links</h2>
        <div>
          <a
            href="https://github.com/yomogyhub"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>
        <div>
          <a
            href="https://x.com/y0m0gy"
            target="_blank"
            rel="noopener noreferrer"
          >
            X (Twitter)
          </a>
        </div>
      </div>
      <div className="flex-1">
        <h2>Legal</h2>
        <Link href="/privacy">
          <p>Privacy</p>
        </Link>
      </div>
    </footer>
  );
}
