import ScoreAndName from "../ScoreAndName";

type GameMemberProps = {
  username: string;
  symbol: string;
  score: number;
  isCurrentMove: boolean;
};

export default function GameMember({
  username,
  symbol,
  score,
  isCurrentMove,
}: GameMemberProps) {

  return (
    <div className="flex items-center flex-col gap-4">
      <div className="relative">
        <div className={`relative flex items-center justify-center w-20 h-20 rounded-full text-5xl font-bold transition-all duration-300 ${
          isCurrentMove
            ? "bg-gradient-to-br from-purple-600 to-pink-600 text-white scale-110"
            : symbol === "X"
              ? "bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-blue-400 border-2 border-blue-500/30"
              : symbol === "0"
                ? "bg-gradient-to-br from-red-500/20 to-orange-500/20 text-red-400 border-2 border-red-500/30"
                : "bg-gradient-to-br from-gray-500/20 to-gray-600/20 text-gray-500 border-2 border-gray-500/30"
        }`}>
          <span className="drop-shadow-lg">{symbol}</span>
        </div>
      </div>
      <div className="relative">
        <div className={`relative backdrop-blur-sm border rounded-lg p-4 ${
          isCurrentMove
            ? "bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20"
            : symbol === "X"
              ? "bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20"
              : "bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-500/20"
        }`}>
          <ScoreAndName username={username} length={score} />
        </div>
      </div>
    </div>
  );
}
