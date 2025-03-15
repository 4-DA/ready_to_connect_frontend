import { createContext, useState, useEffect, useContext } from "react";

const GamificationContext = createContext();

export function GamificationProvider({ children }) {
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [coins, setCoins] = useState(100);
  const [skills, setSkills] = useState([
    { id: 1, name: "HTML Basics", unlocked: true, completed: false },
    { id: 2, name: "CSS Basics", unlocked: false, completed: false, prerequisite: 1 },
  ]);
  const [badges, setBadges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    checkStreak();
  }, []);

  const gainXp = (amount) => {
    setXp((prev) => {
      const newXp = prev + amount;
      if (newXp >= level * 100) {
        setLevel((prev) => prev + 1);
        unlockSkills();
      }
      return newXp;
    });
  };

  const unlockSkills = () => {
    setSkills((prevSkills) =>
      prevSkills.map((skill) =>
        skill.prerequisite && skill.prerequisite === level
          ? { ...skill, unlocked: true }
          : skill
      )
    );
  };

  const checkStreak = () => {
    const today = new Date().toDateString();
    const lastActive = localStorage.getItem("lastActive");
    if (lastActive !== today) {
      if (lastActive && (new Date(today) - new Date(lastActive) === 86400000)) {
        setStreak((prev) => prev + 1);
      } else {
        setStreak(1);
      }
      localStorage.setItem("lastActive", today);
    }
  };

  const value = { xp, level, streak, coins, skills, gainXp, checkStreak };
  return <GamificationContext.Provider value={value}>{children}</GamificationContext.Provider>;
}

export function useGamification() {
  return useContext(GamificationContext);
}
