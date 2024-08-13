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
        <GameMember
          username={"No opponent yet!"}
          symbol={"-"}
          score={0}
          isCurrentMove={false}
        />
      )}
    </div>
  );
}
