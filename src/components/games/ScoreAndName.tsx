import { Crown } from "lucide-react";
import React, { useMemo } from "react";

type ScoreAndNameProps = {
  username: string;
  length: number;
};

export default function ScoreAndName({ username, length }: ScoreAndNameProps) {
  const arr = useMemo(() => new Array(length).fill(""), [length]);

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-nowrap text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
        {username}
      </p>
      <ul className="flex flex-row gap-2 p-0">
        {arr.map((_, index) => (
          <li 
            className="w-6 h-6 animate-bounce" 
            key={"username:" + Math.random()}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <Crown className="w-full h-full" fill="#F59E0B" stroke="#D97706" strokeWidth={1.5} />
          </li>
        ))}
      </ul>
    </div>
  );
}
