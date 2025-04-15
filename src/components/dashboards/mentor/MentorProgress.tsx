"use client";
import { useEffect, useState } from "react";
import api from "@/utils/api";

interface StudentProgress {
  id: number;
  student_first_name: string;
  student_last_name: string;
  student_email: string;
  course_title: string;
  progress_percentage: number;
  completed: boolean;
}

export default function MentorProgress() {
  const [students, setStudents] = useState<StudentProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignedStudents = async () => {
      try {
        const res = await api.get("/accounts/mentor/linked-students/");
        setStudents(res.data);
      } catch (err) {
        console.error("MentorProgress - Failed to load assigned students", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignedStudents();
  }, []);

  return (
    <div className="p-4 bg-[#1c1c24] rounded-xl border border-white/10 shadow">
      <h2 className="text-xl font-semibold mb-4">Assigned Students</h2>

      {loading ? (
        <p>Loading...</p>
      ) : students.length === 0 ? (
        <p className="text-gray-400">No assigned students found.</p>
      ) : (
        <ul className="space-y-4">
          {students.map((student) => (
            <li
              key={student.id}
              className="p-4 bg-[#2c2c34] rounded-lg flex justify-between items-center"
            >
              <div>
                <p className="font-medium">
                  {student.student_first_name} {student.student_last_name}
                </p>
                <p className="text-sm text-gray-400">{student.student_email}</p>
                <p className="text-sm mt-1 text-indigo-400">
                  Course: {student.course_title}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm">Progress</p>
                <p
                  className={`text-xl font-bold ${
                    student.progress_percentage >= 80 ? "text-green-400" : "text-yellow-400"
                  }`}
                >
                  {student.progress_percentage}%
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
