import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast"; // Import Toaster để dùng notification

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "DEGEN Z Staking App",
  description: "Stake $Z and claim $KZ rewards on-chain",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}>
        {children}

        {/* Global notification toaster */}
        <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
  );
}
