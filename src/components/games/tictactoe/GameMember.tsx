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
    <div className="flex items-center flex-col">
      <p className={`text-3xl ${isCurrentMove && "text-primary"}`}>{symbol}</p>
      <ScoreAndName username={username} length={score} />
    </div>
  );
}
