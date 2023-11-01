import "@/styles/globals.css";
import "prismjs/themes/prism-tomorrow.css";
import type { AppProps } from "next/app";
import RootLayout from "../components/layout";
import Seo from "../components/seo";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RootLayout>
      <Seo />
      <main
        className={`flex min-h-screen flex-col items-center justify-between px-1 lg:px-0 ${inter.className}`}
      >
        <Component {...pageProps} />
      </main>
    </RootLayout>
  );
}
