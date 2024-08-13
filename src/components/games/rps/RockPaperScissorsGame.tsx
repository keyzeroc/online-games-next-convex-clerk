"use client";

import { useMutation, useQuery } from "convex/react";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import Player from "./Player";
import Opponent from "./Opponent";
import { AllDatabaseTypes } from "@/types/types";
import Chat from "@/components/chat/Chat";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";

type Props = {
  roomDetails: AllDatabaseTypes["room"];
};

export default function RockPaperScissorsGame({ roomDetails }: Props) {
  const gameDetails = useQuery(api.rps.getGameDetails, {
    roomId: roomDetails._id,
  });
  const makeAMoveMutation = useMutation(api.rps.makeAMove);
  const resetGameStateMutation = useMutation(api.rps.resetGameState);
  const { toast } = useToast();
  const { user } = useUser();

  const onPlayerMove = async (choice: string) => {
    await makeAMoveMutation({
      roomId: roomDetails?._id as Id<"room">,
      gameId: gameDetails?._id as Id<"rps">,
      choice,
    });
  };

  useEffect(() => {
    if (gameDetails?.moves.length === 2 && gameDetails.rounds.length !== 0) {
      let winnerId =
        gameDetails?.rounds[gameDetails?.rounds.length - 1].winnerId;
      let winningAlertString =
        winnerId === null
          ? "Draw!"
          : winnerId === user?.id
            ? "You won!"
            : roomDetails?.players.find((pl) => pl.userId === winnerId)
                ?.userName + " won!";
      toast({
        title: winningAlertString,
        description: "Next round will start in 3 seconds...",
      });
      resetGameStateMutation({ gameId: gameDetails._id });
    }
  }, [gameDetails?.rounds]);

  return (
    <section className="flex flex-col gap-8">
      <Chat roomId={roomDetails?._id} />
      {roomDetails?.players.find((pl) => pl.userId === user?.id) && (
        <div className="flex w-full flex-col gap-12">
          <h3 className="text-center text-3xl">
            Round {(gameDetails?.rounds?.length as number) + 1}
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "4fr 1fr 4fr",
            }}
            className="gap-8"
          >
            <Player
              onPlayerMove={onPlayerMove}
              gameDetails={gameDetails as AllDatabaseTypes["rps"]}
            />
            <div className="w-fit max-w-fit self-center justify-self-center text-3xl font-bold">
              VS
            </div>
            <Opponent
              roomDetails={roomDetails}
              gameDetails={gameDetails as AllDatabaseTypes["rps"]}
            />
          </div>
        </div>
      )}
    </section>
  );
}
