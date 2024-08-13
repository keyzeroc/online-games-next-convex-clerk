"use client";

import { useQuery } from "convex/react";
import { notFound, useParams } from "next/navigation";
import Chat from "@/components/chat/Chat";
import { api } from "../../../../convex/_generated/api";
import CreateGameForm from "@/components/games/lobby/CreateGameForm";
import { useUser } from "@clerk/nextjs";
import { GAME_TYPES } from "@/lib/gamestate";
import GamesTable from "@/components/games/lobby/GamesTable";

export default function GamePage() {
  const { gameType } = useParams<{ gameType: string }>();
  const foundGametype = GAME_TYPES.find((gt) => gt.shortName === gameType);
  if (!foundGametype) notFound();
  const { isSignedIn, isLoaded } = useUser();

  const rooms = useQuery(api.room.getRoomsByGameType, { gameType });

  return (
    <div className="flex flex-col gap-16">
      <Chat />
      <h2 className="self-center text-4xl">{foundGametype.fullName}</h2>
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex min-w-72 flex-col gap-4 text-center">
          <p className="text-xl">Create Game</p>
          {isLoaded && isSignedIn && <CreateGameForm gameType={gameType} />}
        </div>
        <div className="flex w-full flex-col gap-4">
          {rooms && rooms.length > 0 && (
            <>
              <p className="text-center text-xl">Join game</p>
              <GamesTable rooms={rooms} />
            </>
          )}
          {rooms && rooms.length == 0 && (
            <div className="self-center">
              No games found! Be first to create one.
            </div>
          )}
          {!rooms && (
            <div className="self-center">
              No games found! Be first to create one.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
