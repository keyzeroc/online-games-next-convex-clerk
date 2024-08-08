"use client";

import { Authenticated } from "convex/react";
import { Id } from "../../../../../convex/_generated/dataModel";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import RockPaperScissorsGame from "../../../../components/games/rps/RockPaperScissorsGame";
import TicTacToeGame from "../../../../components/games/tictactoe/TicTacToeGame";

export default function Game() {
  const router = useRouter();
  const { gameType, gameId } = useParams<{
    gameId: Id<"room">;
    gameType: string;
  }>();

  const { isSignedIn, isLoaded } = useUser();
  if (isLoaded && !isSignedIn) router.push("/");

  return (
    <section>
      <Authenticated>
        {gameType === "rps" && <RockPaperScissorsGame roomId={gameId} />}
        {gameType === "tictactoe" && <TicTacToeGame roomId={gameId} />}
      </Authenticated>
    </section>
  );
}
