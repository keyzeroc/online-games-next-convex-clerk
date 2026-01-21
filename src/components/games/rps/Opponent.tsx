"use client";
import { possibleChoices } from "@/lib/rps";
import { AllDatabaseTypes } from "@/types/types";
import { useUser } from "@clerk/nextjs";
import React from "react";
import Spinner from "@/components/Spinner";
import ScoreAndName from "../ScoreAndName";

type OpponentProps = {
  roomDetails: AllDatabaseTypes["room"];
  gameDetails: AllDatabaseTypes["rps"];
};

export default function Opponent({ roomDetails, gameDetails }: OpponentProps) {
  const { user } = useUser();
  const opponentChoice = gameDetails?.moves.find(
    (move) => move.playerId !== user?.id,
  )?.choice;
  const isSpinnerDisplayed = !opponentChoice || gameDetails?.moves.length < 2;

  return (
    <div className="flex flex-col items-center gap-8">
      {roomDetails?.players.length === 1 && (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg blur opacity-25" />
          <p className="relative text-center text-xl font-semibold bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent py-8">
            Waiting for opponent...
          </p>
        </div>
      )}
      {roomDetails?.players.length > 1 && (
        <>
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg blur opacity-25" />
            <div className="relative bg-gradient-to-br from-red-500/10 to-orange-500/10 backdrop-blur-sm border border-red-500/20 rounded-lg p-4">
              <ScoreAndName
                length={
                  gameDetails?.rounds.filter(
                    (round) =>
                      round.winnerId !== null && round.winnerId !== user?.id,
                  ).length
                }
                username={
                  roomDetails?.players.find((pl) => pl.userId !== user?.id)
                    ?.userName as string
                }
              />
            </div>
          </div>
          {isSpinnerDisplayed && (
            <div className="flex aspect-square max-h-[256px] min-h-20 min-w-20 flex-1 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 shadow-xl">
              <Spinner />
            </div>
          )}
          {opponentChoice && gameDetails?.moves.length === 2 && (
            <div className="aspect-square min-h-20 min-w-20 animate-bounce">
              <div className="relative w-full h-full bg-gradient-to-br from-red-500 to-orange-500 rounded-xl p-3 shadow-xl">
                <img
                  className="w-full h-full object-contain drop-shadow-lg"
                  src={
                    possibleChoices.find(
                      (choice) => choice.name === opponentChoice,
                    )?.image
                  }
                  alt={opponentChoice}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
