"use client";

import { useQuery } from "convex/react";
import { notFound, useParams } from "next/navigation";
import Chat from "@/components/chat/Chat";
import { api } from "../../../../convex/_generated/api";
import CreateGameForm from "@/components/games/lobby/CreateGameForm";
import { useUser } from "@clerk/nextjs";
import { GAME_TYPES } from "@/lib/gametypes";
import GamesTable from "@/components/games/lobby/GamesTable";

export default function GamePage() {
  const { gameType } = useParams<{ gameType: string }>();
  const foundGametype = GAME_TYPES[gameType as keyof typeof GAME_TYPES];
  if (!foundGametype) notFound();
  const { isSignedIn, isLoaded } = useUser();

  const rooms = useQuery(api.room.getRoomsByGameType, { gameType });

  return (
    <div className="flex flex-col gap-8 md:gap-12 lg:gap-16">
      <Chat />
      <h2 className="self-center text-2xl sm:text-3xl md:text-4xl">{foundGametype.fullName}</h2>
      <div className="flex flex-col gap-8 lg:flex-row">
        {isLoaded && isSignedIn && (
          <div className="flex flex-col gap-4 text-center lg:min-w-72">
            <p className="text-lg sm:text-xl">Create Game</p>
            <CreateGameForm gameType={gameType} />
          </div>
        )}
        <div className="flex w-full flex-col gap-4">
          {rooms && rooms.length > 0 && (
            <>
              <p className="text-center text-lg sm:text-xl">Join game</p>
              <GamesTable rooms={rooms} />
            </>
          )}
          {rooms && rooms.length == 0 && (
            <div className="self-center text-sm sm:text-base">
              No games found! Be first to create one.
            </div>
          )}
          {!rooms && (
            <div className="self-center text-sm sm:text-base">
              No games found! Be first to create one.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
