"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import api from "@/utils/api";

interface Mentee {
  id: number;
  student_first_name: string;
  student_last_name: string;
  student_email: string;
  linked_at: string;
}

export default function MenteesPage() {
  const [mentees, setMentees] = useState<Mentee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMentees = async () => {
      try {
        const response = await api.get("/accounts/mentor/assigned-students/");
        setMentees(response.data.results);
      } catch (error) {
        console.error("Failed to fetch mentees:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMentees();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#0e0e13] text-white">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">My Assigned Students</h1>
        {loading ? (
          <p>Loading...</p>
        ) : mentees.length === 0 ? (
          <p>No students have been assigned to you yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mentees.map((mentee) => (
              <div
                key={mentee.id}
                className="bg-[#1a1a22] p-5 rounded-lg shadow-md border border-white/10"
              >
                <h3 className="text-lg font-semibold">
                  {mentee.student_first_name} {mentee.student_last_name}
                </h3>
                <p className="text-sm text-gray-400">{mentee.student_email}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Linked on {new Date(mentee.linked_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
