"use client";

import { Unauthenticated } from "convex/react";
import { SignInButton } from "@clerk/nextjs";
import Chat from "../components/chat/Chat";
import { useRouter } from "next/navigation";
import { GAME_TYPES } from "@/lib/gametypes";

export default function Home() {
  const router = useRouter();

  return (
    <section className="flex flex-col gap-8">
      <Chat />
      <Unauthenticated>
        <div className="flex items-center justify-center">
          <span className="mx-1 text-primary">
            <SignInButton />
          </span>
          with Google account to be able to create and join games
        </div>
      </Unauthenticated>
      <ul className="flex justify-center gap-8">
        {Object.values(GAME_TYPES).map((gameType) => (
          <li
            className={`flex h-96 min-h-96 w-96 min-w-96 items-center justify-center border border-primary hover:scale-105`}
            key={"gt:" + gameType.shortName}
          >
            <button
              onClick={() => router.push(`/games/${gameType.shortName}`)}
              className={`h-full w-full bg-cover`}
              style={{
                backgroundImage: `url(${gameType.image})`,
              }}
            ></button>
          </li>
        ))}
      </ul>
    </section>
  );
}
