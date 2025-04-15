// src/app/layout.tsx
import "@/styles/globals.css";
import type { Metadata } from "next";
import { AuthProvider } from "@/contexts/AuthContext"; // Updated import
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./providers/ThemeProvider";

export const metadata: Metadata = {
  title: "Ready to Connect Dashboard",
  description: "Internship dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>
        <AuthProvider>
        <ThemeProvider>
          {children}
          <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

