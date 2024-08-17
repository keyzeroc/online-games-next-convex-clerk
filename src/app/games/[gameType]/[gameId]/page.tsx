"use client";

import { Authenticated, useQuery } from "convex/react";
import { Id } from "../../../../../convex/_generated/dataModel";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import RockPaperScissorsGame from "../../../../components/games/rps/RockPaperScissorsGame";
import TicTacToeGame from "../../../../components/games/tictactoe/TicTacToeGame";
import { api } from "../../../../../convex/_generated/api";
import { GAME_TYPES } from "@/lib/gametypes";
import BattleShips from "@/components/games/battleships/BattleShips";

export default function Game() {
  const router = useRouter();
  const { gameType, gameId } = useParams<{
    gameId: Id<"room">;
    gameType: string;
  }>();

  const roomDetails = useQuery(api.room.getRoomById, { roomId: gameId });

  const { isSignedIn, user, isLoaded } = useUser();
  if (isLoaded && !isSignedIn) router.push("/");

  return (
    <section>
      {roomDetails?.players.find((pl) => pl.userId === user?.id) && (
        <Authenticated>
          {gameType === GAME_TYPES.rps.shortName && (
            <RockPaperScissorsGame roomDetails={roomDetails} />
          )}
          {gameType === GAME_TYPES.tictactoe.shortName && (
            <TicTacToeGame roomDetails={roomDetails} />
          )}
           {gameType === GAME_TYPES.battleships.shortName && (
            <BattleShips roomDetails={roomDetails} />
          )}
        </Authenticated>
      )}
    </section>
  );
}
