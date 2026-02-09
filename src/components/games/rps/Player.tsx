"use client";

import { possibleChoices } from "@/lib/rps";
import { AllDatabaseTypes } from "@/types/types";
import { useUser } from "@clerk/nextjs";
import ScoreAndName from "../ScoreAndName";

type PlayerProps = {
  onPlayerMove: (choice: string) => void;
  gameDetails: AllDatabaseTypes["rps"];
};

export default function Player({ onPlayerMove, gameDetails }: PlayerProps) {
  const { user } = useUser();

  const playerMove =
    user && gameDetails?.moves.find((move) => move.playerId === user.id);

  return (
    <div className="flex flex-col items-center gap-4 md:gap-6 lg:gap-8">
      <div className="relative">
        <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg blur opacity-25" />
        <div className="relative bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm border border-blue-500/20 rounded-lg p-3 md:p-4">
          <ScoreAndName
            length={
              gameDetails?.rounds.filter((round) => round.winnerId === user?.id)
                .length
            }
            username={user?.fullName as string}
          />
        </div>
      </div>
      <ul className="flex justify-center gap-3 sm:gap-4 md:gap-6">
        {!playerMove?.choice &&
          possibleChoices.map((choice) => {
            return (
              <li
                key={"ch:" + choice.name}
                className="group relative aspect-square h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 lg:h-32 lg:w-32 xl:h-36 xl:w-36 cursor-pointer transition-all duration-300 hover:scale-110"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-0 group-hover:opacity-75 transition duration-300" />
                <button 
                  onClick={() => onPlayerMove(choice.name)}
                  className="relative w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-2 md:p-3 lg:p-4 shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  <img
                    className="w-full h-full object-contain drop-shadow-lg"
                    src={choice.image}
                    alt={choice.name}
                  />
                </button>
              </li>
            );
          })}
        {playerMove?.choice && (
          <li className="aspect-square h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 lg:h-32 lg:w-32 xl:h-36 xl:w-36 animate-pulse">
            <div className="relative w-full h-full bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-2 md:p-3 lg:p-4 shadow-xl">
              <img
                className="w-full h-full object-contain drop-shadow-lg"
                src={
                  possibleChoices.find(
                    (choice) => choice.name === playerMove?.choice,
                  )?.image
                }
                alt={playerMove?.choice}
              />
            </div>
          </li>
        )}
      </ul>
    </div>
  );
}
