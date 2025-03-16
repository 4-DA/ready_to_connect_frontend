// pages/_app.tsx
import type { AppProps } from "next/app";
import { AuthProvider } from "../contexts/AuthContext";
import "../app/globals.css"; // Adjust this path to your global CSS file

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
