"use client";

import { withProtectedRoute } from "@/components/ProtectedRoute";
import Dashboard from "@/components/Dashboard"; // Adjust the import path as needed

export default withProtectedRoute(Dashboard);
