"use client";
import { possibleChoices } from "@/lib/rps";
import { AllDatabaseTypes } from "@/types/types";
import { useUser } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import React from "react";
import Spinner from "@/components/Spinner";
import ScoreAndName from "./ScoreAndName";

type OpponentProps = {
  roomDetails: AllDatabaseTypes["room"];
  gameDetails: AllDatabaseTypes["rps"];
};

export default function Opponent({ roomDetails, gameDetails }: OpponentProps) {
  const { user } = useUser();
  const { theme } = useTheme();
  const opponentMove = gameDetails.moves.find(
    (move) => move.playerId !== user?.id,
  );
  const isSpinnerDisplayed =
    !opponentMove?.choice || gameDetails.moves.length < 2;

  return (
    <div className="flex flex-col items-center gap-8">
      {roomDetails.players.length === 1 && (
        <p className="text-center text-xl">No opponent yet</p>
      )}
      {roomDetails.players.length > 1 && (
        <>
          <ScoreAndName
            length={
              gameDetails.rounds.filter((round) => round.winnerId !== user?.id)
                .length
            }
            playerId={opponentMove?.playerId as string}
            username={
              roomDetails.players.find((pl) => pl.userId !== user?.id)
                ?.userName as string
            }
          />
          {isSpinnerDisplayed && (
            <div className="flex aspect-square max-h-[256px] min-h-12 min-w-12 flex-1 rounded-md">
              <Spinner />
            </div>
          )}
          {opponentMove?.choice && gameDetails.moves.length === 2 && (
            <div className="aspect-square min-h-12 min-w-12 rounded-md p-2">
              <img
                className={`${theme === "dark" ? "" : "invert"}`}
                src={
                  possibleChoices.find(
                    (choice) => choice.name === opponentMove.choice,
                  )?.image
                }
                alt={opponentMove.choice}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
