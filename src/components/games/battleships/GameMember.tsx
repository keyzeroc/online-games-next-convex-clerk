import { AllDatabaseTypes } from "@/types/types";
import GameBoard from "./GameBoard";
import ScoreAndName from "../ScoreAndName";
import Spinner from "@/components/Spinner";

type PlayerProps = {
  gameDetails: AllDatabaseTypes["battleships"];
  userId: string;
  userName: string;
  isOpponent: boolean;
  onMove: (rowIndex: number, colIndex: number) => void;
};

export default function GameMember({
  gameDetails,
  userId,
  userName,
  isOpponent,
  onMove,
}: PlayerProps) {
  const board = gameDetails?.playerBoards.find(
    (pb) => pb.playerId === userId,
  )?.board;
  const isCurrentMove =
    gameDetails?.currentMovePlayerId !== null &&
    gameDetails?.currentMovePlayerId === userId;

  return (
    <div className="flex flex-col items-center gap-8">
      <ScoreAndName
        username={userName ? userName : "No Opponent Yet"}
        length={
          gameDetails?.rounds.filter((round) => round.winnerId === userId)
            ?.length as number
        }
      />
      {board && (
        <GameBoard
          isCurrentMove={isCurrentMove}
          isOpponent={isOpponent}
          board={board}
          onMove={onMove}
        />
      )}
      {isCurrentMove && (
        <div className="h-10 w-10">
          <Spinner />
        </div>
      )}
    </div>
  );
}
