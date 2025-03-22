"use client";

import { useRouter } from "next/navigation";
import HomePage from "@/components/Homepage";
// This is the entry point - the default route
export default function Home() {
  const router = useRouter();

  return <HomePage />;
}
