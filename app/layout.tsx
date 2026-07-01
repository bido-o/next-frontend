import type { Metadata } from "next";
import { Fraunces, Bricolage_Grotesque } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

// Font display: headings, titluri.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
});

// Font body: text, butoane, formulare.
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Bido",
  description: "Mâncare pentru evenimentul tău, fără sute de telefoane.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ro"
      className={`${fraunces.variable} ${bricolage.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
