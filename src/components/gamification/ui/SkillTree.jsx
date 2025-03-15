import { useGamification } from "../../../context/GamificationContext";

export default function SkillTree() {
  const { level } = useGamification();
  const skills = [
    { id: 1, name: "Introduction", unlocked: true },
    { id: 2, name: "Intermediate Concepts", unlocked: level >= 2 },
    { id: 3, name: "Advanced Concepts", unlocked: level >= 3 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {skills.map((skill) => (
        <div
          key={skill.id}
          className={`p-4 border-2 rounded-lg text-center ${
            skill.unlocked ? "border-green-500" : "border-gray-400 opacity-50"
          }`}
        >
          {skill.name}
        </div>
      ))}
    </div>
  );
}
