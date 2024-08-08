"use client";

import { useQuery } from "convex/react";
import { notFound, useParams } from "next/navigation";
import Chat from "@/components/chat/Chat";
import { api } from "../../../../convex/_generated/api";
import { JoinGameDialog } from "@/app/JoinGameDialog";
import CreateGameForm from "@/app/CreateGameForm";
import { useUser } from "@clerk/nextjs";
import { GAME_TYPES } from "@/lib/gamestate";

export default function GamePage() {
  const { gameType } = useParams();
  if (!GAME_TYPES.find((gt) => gt.shortName === gameType)) notFound();
  const { isSignedIn, isLoaded } = useUser();

  const rooms = useQuery(api.room.getRoomsByGameType, {
    gameType: gameType as string,
  });

  return (
    <div className="flex flex-col gap-8">
      <Chat />
      {isLoaded && isSignedIn && (
        <CreateGameForm gameType={gameType as string} />
      )}
      {rooms && rooms?.length === 0 && (
        <div className="flex flex-col gap-4">
          <h3 className="text-center">
            No active games found, be first to create one!
          </h3>
        </div>
      )}
      {rooms && rooms.length > 0 && (
        <ul className="flex w-full gap-4 border">
          {rooms?.map((room) => (
            <li
              className="flex min-w-44 flex-col gap-2 rounded-sm border p-2"
              key={room._id}
            >
              <p className="text-center">{room.name}</p>
              <p>
                {room.password !== "" ? "Password protected" : "Free to join"}
              </p>
              <JoinGameDialog room={room} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
