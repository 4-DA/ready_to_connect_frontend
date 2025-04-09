// src/app/layout.tsx

import "@/styles/globals.css";
import type { Metadata } from "next";
import AuthWrapper from "@/components/AuthWrapper";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Ready to Connect Dashboard",
  description: "Internship dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>
        <AuthWrapper>
          {children}
          <Toaster />  
        </AuthWrapper>
      </body>
    </html>
  );
}
