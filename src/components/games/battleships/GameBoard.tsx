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

  const cellClasses = "flex h-10 w-10 items-center justify-center border";

  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col border-2">
        <div className="flex first:border-none">
          <div className={cellClasses}></div>
          {xAxisMarks.split("").map((letter) => (
            <div key={letter} className={cellClasses}>
              {letter}
            </div>
          ))}
        </div>
        {yAxisMarks.map((row) => (
          <div key={row} className="flex">
            <div className={cellClasses}>{row}</div>
            {yAxisMarks.map((col) => (
              <div
                className={`${cellClasses} ${isOpponent && !isCurrentMove && "hover:bg-primary"}`}
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
  );
}
