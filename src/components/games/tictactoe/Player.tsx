import GameMember from "./GameMember";
import { AllDatabaseTypes } from "@/types/types";

type PlayerProps = {
  playerSymbol: string;
  gameDetails: AllDatabaseTypes["tictactoe"];
  userId: string | null | undefined;
  userName: string;
};

export default function Player({
  playerSymbol,
  gameDetails,
  userId,
  userName,
}: PlayerProps) {
  const wonRounds = gameDetails?.rounds.filter(
    (round) => round.winnerId === userId,
  )?.length as number;

  const isCurrentMove =
    gameDetails?.currentMoveSymbol !== null &&
    gameDetails?.currentMoveSymbol === playerSymbol;

  return (
    <div>
      <GameMember
        username={userName}
        symbol={playerSymbol}
        score={wonRounds}
        isCurrentMove={isCurrentMove}
      />
    </div>
  );
}
