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
    <div className="flex flex-col items-center gap-4 md:gap-6">
      <div className="relative">
        <div className={`relative backdrop-blur-sm border rounded-lg p-2 sm:p-3 md:p-4 ${
          isOpponent
            ? "bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-500/20"
            : "bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20"
        }`}>
          <ScoreAndName
            username={userName ? userName : "No Opponent Yet"}
            length={
              gameDetails?.rounds.filter((round) => round.winnerId === userId)
                ?.length as number
            }
          />
        </div>
      </div>
      {board && (
        <GameBoard
          isCurrentMove={isCurrentMove}
          isOpponent={isOpponent}
          board={board}
          onMove={onMove}
        />
      )}
      {isCurrentMove && (
        <div className="flex items-center gap-2 md:gap-3 px-3 py-2 md:px-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full text-white text-sm md:text-base font-semibold shadow-lg">
          <div className="h-6 w-6 md:h-8 md:w-8">
            <Spinner />
          </div>
          <span>{isOpponent ? "Opponent's Turn" : "Your Turn"}</span>
        </div>
      )}
    </div>
  );
}
