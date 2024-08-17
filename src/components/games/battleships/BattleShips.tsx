"use client";

import { AllDatabaseTypes } from "@/types/types";
import { useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { toast } from "@/components/ui/use-toast";
import { Id } from "../../../../convex/_generated/dataModel";
import GameMember from "./GameMember";
import Chat from "@/components/chat/Chat";

type BattleShipsProps = {
  roomDetails: AllDatabaseTypes["room"];
};

export default function BattleShips({ roomDetails }: BattleShipsProps) {
  const gameDetails = useQuery(api.battleships.getGameDetails, {
    roomId: roomDetails?._id,
  });
  const makeAMoveMutation = useMutation(api.battleships.makeAMove);
  const resetGameStateMutation = useMutation(api.battleships.resetGameState);
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (gameDetails?.currentMovePlayerId === null) {
      let winnerId =
        gameDetails?.rounds[gameDetails?.rounds.length - 1].winnerId;

      let winnerName =
        winnerId === user?.id
          ? "You"
          : roomDetails?.players.find((pl) => pl.userId === winnerId)?.userName;

      toast({
        title: `${winnerName} won!`,
        description: "Next round will start in 3 seconds...",
      });
      resetGameStateMutation({ gameId: gameDetails?._id as Id<"battleships"> });
    }
  }, [gameDetails?.rounds]);

  const onMoveHandler = (rowIndex: number, colIndex: number) => {
    if (!gameDetails?.playerBoards[0]) return;
    if (rowIndex < 0 || rowIndex >= gameDetails?.playerBoards[0].board.length)
      return;
    if (colIndex < 0 || colIndex >= gameDetails?.playerBoards[0].board.length)
      return;
    makeAMoveMutation({
      roomId: roomDetails?._id,
      gameId: gameDetails?._id as Id<"battleships">,
      rowIndex,
      colIndex,
    });
  };

  const contentLoading = !isLoaded || !gameDetails || !roomDetails;

  return (
    <div className="flex flex-col gap-8">
      <Chat roomId={roomDetails?._id} />
      <div className="flex justify-around gap-4">
        {contentLoading && <p>Loading...</p>}
        {/* PLAYER */}
        {!contentLoading && (
          <GameMember
            onMove={onMoveHandler}
            isOpponent={false}
            userName={user?.fullName as string}
            userId={user?.id as string}
            gameDetails={gameDetails as AllDatabaseTypes["battleships"]}
          />
        )}
        {/* OPPONENT */}
        {!contentLoading && (
          <GameMember
            onMove={onMoveHandler}
            isOpponent={true}
            userName={
              roomDetails.players.find((pl) => pl.userId !== user?.id)
                ?.userName as string
            }
            userId={
              roomDetails.players.find((pl) => pl.userId !== user?.id)
                ?.userId as string
            }
            gameDetails={gameDetails as AllDatabaseTypes["battleships"]}
          />
        )}
      </div>
    </div>
  );
}
