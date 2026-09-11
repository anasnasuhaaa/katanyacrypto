import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kunci Rahasia | Katanya Crypto",
  description: "Pecahkan petunjuk dan temukan kunci rahasia yang tersembunyi.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
