"use client";
import { possibleChoices } from "@/lib/rps";
import { AllDatabaseTypes } from "@/types/types";
import { useUser } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { Crown } from "lucide-react";
import ScoreAndName from "../ScoreAndName";

type PlayerProps = {
  onPlayerMove: (choice: string) => void;
  gameDetails: AllDatabaseTypes["rps"];
};

export default function Player({ onPlayerMove, gameDetails }: PlayerProps) {
  const { user } = useUser();
  const { theme } = useTheme();

  const playerMove =
    user && gameDetails?.moves.find((move) => move.playerId === user.id);

  return (
    <div className="flex flex-col gap-8">
      <ScoreAndName
        length={
          gameDetails?.rounds.filter((round) => round.winnerId === user?.id)
            .length
        }
        username={user?.fullName as string}
      />
      <ul className="flex justify-center gap-4">
        {!playerMove?.choice &&
          possibleChoices.map((choice) => {
            return (
              <li
                key={"ch:" + choice.name}
                className="aspect-square min-h-12 min-w-12 cursor-pointer rounded-md bg-primary p-2"
              >
                <button onClick={() => onPlayerMove(choice.name)}>
                  <img
                    className={`${theme === "dark" ? "" : "invert"} hover:scale-105`}
                    src={choice.image}
                    alt={choice.name}
                  />
                </button>
              </li>
            );
          })}
        {playerMove?.choice && (
          <li className="aspect-square min-h-12 min-w-12 rounded-md p-2">
            <img
              className={`${theme === "dark" ? "" : "invert"}`}
              src={
                possibleChoices.find(
                  (choice) => choice.name === playerMove?.choice,
                )?.image
              }
              alt={playerMove?.choice}
            />
          </li>
        )}
      </ul>
    </div>
  );
}
