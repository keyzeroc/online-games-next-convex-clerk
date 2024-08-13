import { Crown } from "lucide-react";
import React from "react";

type ScoreAndNameProps = {
  username: string;
  length: number;
};

export default function ScoreAndName({ username, length }: ScoreAndNameProps) {
  const arr = new Array(length).fill("");

  return (
    <div className="flex flex-row flex-nowrap justify-center gap-2 font-bold">
      <p className="text-nowrap text-xl">{username}</p>
      <ul className="flex flex-row gap-2 p-0">
        {arr.map((_, index) => (
          <li className="w-5" key={username + "-" + length + ":" + index}>
            <Crown fill="#7C3AED" />
          </li>
        ))}
      </ul>
    </div>
  );
}
