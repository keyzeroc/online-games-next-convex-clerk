import { RpsMoves } from "../../convex/schema";

export const possibleChoices = [
  {
    name: "ROCK",
    image: "/assets/rps/rock.png",
  },
  {
    name: "PAPER",
    image: "/assets/rps/paper.png",
  },
  {
    name: "SCISSORS",
    image: "/assets/rps/scissors.png",
  },
];

const gameRules: Record<string, { wins: string[]; loses: string[] }> = {
  ROCK: {
    wins: ['SCISSORS'],
    loses: ['PAPER']
  },
  PAPER: {
    wins: ['ROCK'],
    loses: ['SCISSORS']
  },
  SCISSORS: {
    wins: ['PAPER'],
    loses: ['ROCK']
  }
};

export const decideRpsWinner = (moves: RpsMoves) => {
  if (moves[0].choice === moves[1].choice) {
    return "";
  } else if (gameRules[moves[0].choice].wins.includes(moves[1].choice)) {
    return moves[0].playerId;
  } else {
    return moves[1].playerId;
  }

}

