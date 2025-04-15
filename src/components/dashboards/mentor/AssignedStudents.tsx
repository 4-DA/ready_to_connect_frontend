"use client";

import { useEffect, useState } from "react";
import api from "@/utils/api";

interface StudentCard {
  id: number;
  student_first_name: string;
  student_last_name: string;
  student_email: string;
  course_title: string | null;
  progress: number;
  completed: boolean;
  updated_at: string | null;
}

export default function AssignedStudents() {
  const [students, setStudents] = useState<StudentCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get("/accounts/mentor/assigned-students/");
        setStudents(res.data.results);
      } catch (err) {
        console.error("Error fetching assigned students", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold mb-4">Assigned Students</h2>
      {loading ? (
        <p>Loading students...</p>
      ) : students.length === 0 ? (
        <p>No students assigned yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {students.map((s) => (
            <div
              key={s.id}
              className="bg-white/5 border border-white/10 rounded-lg p-4 shadow-md"
            >
              <h3 className="text-lg font-medium">
                {s.student_first_name} {s.student_last_name}
              </h3>
              <p className="text-sm text-gray-400">{s.student_email}</p>
              <p className="text-sm mt-2">
                Course: <span className="text-indigo-300">{s.course_title || "Not assigned"}</span>
              </p>
              <p className="text-sm">
                Progress: {s.progress}%{" "}
                {s.completed && <span className="ml-2 text-green-400">✔ Completed</span>}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
