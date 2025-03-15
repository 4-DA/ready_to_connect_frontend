import { Work as WorkIcon } from '@mui/icons-material';

export default function InternshipsSection() {
  const internships = [
    {
      title: "Software Engineering Intern",
      company: "TechCorp",
      deadline: "3/19/2025"
    },
    {
      title: "Marketing Intern",
      company: "GrowEasy",
      deadline: "3/24/2025"
    },
    {
      title: "Data Analysis Intern",
      company: "DataWorks",
      deadline: "3/29/2025"
    }
  ];

  return (
    <div className="bg-[#1a1a22] rounded-lg p-6">
      <h2 className="text-xl mb-4">Recommended Internships</h2>
      <div className="flex flex-col gap-4">
        {internships.map((internship, index) => (
          <div key={index} className="flex gap-3 items-start">
            <div className="p-2 bg-[#252530] rounded-lg text-purple-400">
              <WorkIcon />
            </div>
            <div>
              <h3 className="font-medium">{internship.title}</h3>
              <p className="text-sm text-gray-400">{internship.company}</p>
              <p className="text-xs text-gray-500">Apply by {internship.deadline}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}