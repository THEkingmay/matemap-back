import type { Metadata } from "next";
// 1. นำเข้าฟอนต์ที่ต้องการ
import { Kanit } from "next/font/google"; 
import "./globals.css";
import { ToastContainer } from "react-toastify";

// 2. กำหนดค่าฟอนต์
const kanit = Kanit({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "700"], 
  variable: "--font-kanit", 
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mate Map",
  description: "admin dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={kanit.className}> 
        <ToastContainer
          position="top-right" // ตำแหน่ง
          autoClose={3000}     // ปิดเองใน 3 วินาที
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light" // หรือ "dark" หรือ "colored"
        />
        {children}
      </body>
    </html>
  );
}