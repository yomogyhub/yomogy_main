import { Inter } from "next/font/google";
import Header from "./header";
import Footer from "./footer";
import { DarkModeProvider } from "./dark-mode";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${inter.className}`}
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <DarkModeProvider>
        <Header />
        <div style={{ flex: 1 }}>{children}</div>
        <Footer />
      </DarkModeProvider>
    </div>
  );
}
