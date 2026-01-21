"use client";

import { CELL_TYPES } from "@/lib/battleships";

type GameBoardProps = {
  isOpponent: boolean;
  board: string[][];
  isCurrentMove: boolean;
  onMove: (rowIndex: number, colIndex: number) => void;
};

const getCellImage = (cellText: string) => {
  if (cellText === CELL_TYPES.HIT.textIcon) {
    return (
      <div className="relative">
        <img className="absolute z-10 bottom-1" src={CELL_TYPES.HIT.image} alt={""} />
        <img
          src={CELL_TYPES.PART.image}
          alt={CELL_TYPES.HIT.textIcon}
        />
      </div>
    );
  } else if (cellText === CELL_TYPES.PART.textIcon) {
    return <img src={CELL_TYPES.PART.image} alt={CELL_TYPES.PART.textIcon} />;
  } else if (cellText === CELL_TYPES.NOTHING.textIcon) {
    return (
      <img src={CELL_TYPES.NOTHING.image} alt={CELL_TYPES.NOTHING.textIcon} />
    );
  } else if (cellText === CELL_TYPES.MISS.textIcon) {
    return <img src={CELL_TYPES.MISS.image} alt={CELL_TYPES.MISS.textIcon} />;
  }
};

export default function GameBoard({
  isOpponent,
  isCurrentMove,
  board,
  onMove,
}: GameBoardProps) {
  const yAxisMarks = board.map((_, index) => index + 1);
  const xAxisMarks = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".substring(0, board.length);

  const cellClasses = "flex h-12 w-12 items-center justify-center border border-blue-400/30 bg-gradient-to-br from-blue-100/50 to-cyan-100/50 dark:from-blue-900/30 dark:to-cyan-900/30 transition-all duration-200";
  const headerCellClasses = "flex h-12 w-12 items-center justify-center border border-blue-500/40 bg-gradient-to-br from-blue-200 to-cyan-200 dark:from-blue-800 dark:to-cyan-800 font-bold text-blue-900 dark:text-blue-100";

  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <div className="relative flex flex-col border-4 border-blue-500/40 rounded-lg overflow-hidden shadow-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
          <div className="flex first:border-none">
            <div className={headerCellClasses}></div>
            {xAxisMarks.split("").map((letter) => (
              <div key={letter} className={headerCellClasses}>
                {letter}
              </div>
            ))}
          </div>
          {yAxisMarks.map((row) => (
            <div key={row} className="flex">
              <div className={headerCellClasses}>{row}</div>
              {yAxisMarks.map((col) => (
                <div
                  className={`${cellClasses} ${
                    isOpponent && !isCurrentMove 
                      ? "hover:bg-gradient-to-br hover:from-red-200/50 hover:to-orange-200/50 dark:hover:from-red-800/50 dark:hover:to-orange-800/50 hover:border-red-400/50 cursor-pointer" 
                      : ""
                  }`}
                  key={`${row}-${col}`}
                >
                  {isOpponent && (
                    <button
                      className={`flex h-full w-full items-center justify-center ${isCurrentMove ? "cursor-default" : "cursor-pointer"}`}
                      onClick={() => onMove(row - 1, col - 1)}
                    >
                      {board[row - 1][col - 1] !== CELL_TYPES.PART.textIcon &&
                        getCellImage(board[row - 1][col - 1])}
                    </button>
                  )}
                  {!isOpponent && (
                    <div className="flex h-full w-full items-center justify-center">
                      {getCellImage(board[row - 1][col - 1])}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
