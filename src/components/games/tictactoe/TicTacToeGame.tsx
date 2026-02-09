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

type TicTacToeGameProps = {
  roomDetails: AllDatabaseTypes["room"];
};

export default function TicTacToeGame({ roomDetails }: TicTacToeGameProps) {
  const gameDetails = useQuery(api.tictactoe.getGameDetails, {
    roomId: roomDetails?._id,
  });
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
    <div className="flex flex-col gap-4 md:gap-6 lg:gap-8">
      <Chat roomId={roomDetails?._id} />
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 blur-3xl" />
        <div className="relative flex flex-row justify-around items-center gap-4 md:gap-6 lg:gap-8 px-2 sm:px-4">
          <Player
            userId={user?.id}
            userName={user?.fullName as string}
            playerSymbol={playerSymbol?.symbol as string}
            gameDetails={gameDetails as AllDatabaseTypes["tictactoe"]}
          />
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 blur-xl opacity-50 animate-pulse" />
              <div className="relative px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white text-2xl md:text-3xl font-bold shadow-2xl">
                VS
              </div>
            </div>
          </div>
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
      </div>
      <div className="relative self-center w-full max-w-md px-2">
        <div className="absolute -inset-4 sm:-inset-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur-xl opacity-30" />
        <div className="relative grid grid-cols-3 gap-2 sm:gap-3 p-3 sm:p-4 bg-gradient-to-br from-gray-900/40 to-gray-800/40 backdrop-blur-sm rounded-2xl border-2 border-purple-500/30 shadow-2xl">
          {gameDetails?.board.map((cellValue, index) => (
            <button
              className={`group relative flex aspect-square w-full items-center justify-center rounded-xl text-3xl sm:text-4xl md:text-5xl font-bold transition-all duration-300 ${
                cellValue === ""
                  ? "cursor-pointer bg-gradient-to-br from-gray-700/50 to-gray-800/50 hover:from-purple-600/30 hover:to-pink-600/30 hover:scale-105 hover:shadow-lg border-2 border-gray-600/50 hover:border-purple-500/50"
                  : "cursor-default bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-2 border-gray-700/50"
              } ${
                cellValue === "X"
                  ? "text-blue-400"
                  : cellValue === "0"
                    ? "text-red-400"
                    : "text-gray-500"
              }`}
              onClick={() => onPlayerMove(index)}
              key={"c:" + index}
            >
              {cellValue === "" && (
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/20 group-hover:to-pink-500/20 rounded-xl transition-all duration-300" />
              )}
              <span className="relative z-10 drop-shadow-lg">{cellValue}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
