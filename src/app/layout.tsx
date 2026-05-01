import type { Metadata } from "next";
import { Manrope, Newsreader } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import "@/styles/globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Zen Focus",
  description: "A calm project management workspace for teams and tasks.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${manrope.variable} ${newsreader.variable}`}>
      <body>
        <AuthProvider>
          <Navbar />
          <main className="relative min-h-[calc(100vh-80px)]">{children}</main>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "rgba(255, 252, 246, 0.96)",
                color: "#233128",
                border: "1px solid #ded9cf",
                borderRadius: "20px",
                boxShadow: "0 20px 40px rgba(58, 69, 56, 0.12)",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
