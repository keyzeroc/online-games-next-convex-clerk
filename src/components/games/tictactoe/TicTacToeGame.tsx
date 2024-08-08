"use client";

import { Id } from "../../../../convex/_generated/dataModel";

type Props = {
  roomId: Id<"room">;
};

export default function TicTacToeGame({ roomId }: Props) {
  return <div>TicTacToeGame</div>;
}
