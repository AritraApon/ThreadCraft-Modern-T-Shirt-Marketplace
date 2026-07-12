import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ThreadCraft – Modern T-Shirt Marketplace",
  description: "Premium T-shirt marketplace with next-gen user experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#F9FAFB] text-gray-900 dark:bg-[#0B0F19] dark:text-gray-100 transition-colors duration-300">

        <Providers>

          <main className="flex-1">
            {children}
          </main>
        </Providers>


        <ToastContainer position="top-center" autoClose={3000} />

      </body>
    </html>
  );
}