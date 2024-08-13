"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import Chat from "@/components/chat/Chat";
import Player from "./Player";
import { AllDatabaseTypes } from "@/types/types";
import Opponent from "./Opponent";
import { useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

type Props = {
  roomDetails: AllDatabaseTypes['room'];
};

export default function TicTacToeGame({ roomDetails }: Props) {
  const gameDetails = useQuery(api.tictactoe.getGameDetails, { roomId: roomDetails?._id });
  const makeAMoveMutation = useMutation(api.tictactoe.makeAMove);
  const resetGameStateMutation = useMutation(api.tictactoe.resetGameState);
  const { user } = useUser();

  const playerSymbol = gameDetails?.playerSymbols.find(
    (ps) => ps.playerId === user?.id,
  );
  const opponentSymbol = gameDetails?.playerSymbols.find(
    (ps) => ps.playerId !== playerSymbol?.playerId,
  );

  const onPlayerMove = async (cellIndex: number) => {
    if (cellIndex > 8 || cellIndex < 0) return;
    if (gameDetails?.currentMoveSymbol !== playerSymbol?.symbol) return;
    if (gameDetails?.board[cellIndex] !== "") return;

    await makeAMoveMutation({
      roomId: roomDetails?._id,
      gameId: gameDetails?._id,
      cellId: cellIndex,
    });
  };
  useEffect(() => {
    if (gameDetails?.currentMoveSymbol === null) {
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
      resetGameStateMutation({ gameId: gameDetails._id });
    }
  }, [gameDetails?.rounds]);

  return (
    <>
      <Chat roomId={roomDetails?._id} />
      <div className="flex flex-col gap-8">
        <div className="flex justify-around gap-4">
          <Player
            userId={user?.id}
            userName={user?.fullName as string}
            playerSymbol={playerSymbol?.symbol as string}
            gameDetails={gameDetails as AllDatabaseTypes["tictactoe"]}
          />
          <Opponent
            opponentUserId={opponentSymbol?.playerId}
            opponentUserName={
              roomDetails?.players.find(
                (pl) => pl.userId === opponentSymbol?.playerId,
              )?.userName as string
            }
            opponentSymbol={playerSymbol?.symbol === "X" ? "0" : "X"}
            gameDetails={gameDetails as AllDatabaseTypes["tictactoe"]}
          />
        </div>
        <div className="grid grid-cols-3 self-center border">
          {gameDetails?.board.map((cellValue, index) => (
            <button
              className={`flex max-h-32 max-w-32 items-center justify-center border p-16 text-4xl text-primary ${cellValue === "" ? "cursor-pointer" : "cursor-default"}`}
              onClick={() => onPlayerMove(index)}
              key={"c:" + index}
            >
              {cellValue}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
