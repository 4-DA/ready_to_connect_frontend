import type { Metadata } from "next";
import "./globals.css";



export const metadata: Metadata = {
  title: 'Ready to Conect Dashboard',
  description: 'Internship dashboard',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body >
        {children}
      </body>
    </html>
  );
}
