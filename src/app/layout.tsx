import type { Metadata } from "next";
import { Source_Sans_3, Saira } from "next/font/google";
import "./globals.css";
import LayoutClient from "../components/layout/LayoutClient";

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
});

const saira = Saira({
  variable: "--font-saira",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TaskCrafter",
  description: "Built By Freemancodz",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
      <body
        className={`${sourceSans.className} ${saira.variable} antialiased`}
      >
        <LayoutClient>
          { children }
        </LayoutClient>
      </body>
    </html>
  );
}
