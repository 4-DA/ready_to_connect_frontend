// src/app/layout.tsx (server)
import "./globals.css";
import type { Metadata } from "next";
import AuthWrapper from "@/components/AuthWrapper";

export const metadata: Metadata = {
  title: "Ready to Connect Dashboard",
  description: "Internship dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Insert the client AuthWrapper here */}
        <AuthWrapper>{children}</AuthWrapper>
      </body>
    </html>
  );
}
