import { AllDatabaseTypes } from "@/types/types";
import GameMember from "./GameMember";

type OpponentProps = {
  opponentSymbol: string;
  gameDetails: AllDatabaseTypes["tictactoe"];
  opponentUserName: string;
  opponentUserId: string | null | undefined;
};

export default function Opponent({
  gameDetails,
  opponentSymbol,
  opponentUserName,
  opponentUserId,
}: OpponentProps) {
  const wonRounds = gameDetails?.rounds.filter(
    (round) => round.winnerId === opponentUserId,
  )?.length as number;

  return (
    <div>
      {opponentUserId && (
        <GameMember
          username={opponentUserName}
          symbol={opponentSymbol}
          score={wonRounds}
          isCurrentMove={
            gameDetails?.currentMoveSymbol !== null &&
            gameDetails?.currentMoveSymbol == opponentSymbol
          }
        />
      )}
      {!opponentUserId && (
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg blur opacity-25" />
            <p className="relative text-center text-lg font-semibold bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent py-4">
              Waiting for opponent...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
