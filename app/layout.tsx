import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FEI Finder - Nájdi si svoj odbor na FEI TUKE",
  description: "Interaktívny nástroj, ktorý ti pomôže vybrať si najvhodnejší študijný program na Fakulte elektrotechniky a informatiky TUKE",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sk">
      <body>
        {children}
      </body>
    </html>
  );
}
