"use client";

import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { SignInButton } from "@clerk/nextjs";
import Chat from "../components/chat/Chat";
import { useRouter } from "next/navigation";
import { GAME_TYPES } from "@/lib/gamestate";

export default function Home() {
  const router = useRouter();

  return (
    <>
      <Chat />
      <section className="flex flex-col gap-8">
        <Authenticated>
          <ul className="flex justify-center gap-8">
            {GAME_TYPES.map((gameType) => (
              <li
                className={`flex h-48 min-h-48 w-48 min-w-48 items-center justify-center border border-primary hover:scale-105`}
                key={"gt:" + gameType.shortName}
              >
                <button
                  onClick={() => router.push(`/games/${gameType.shortName}`)}
                  className={`h-full w-full bg-cover`}
                  style={{
                    backgroundImage: `url('/assets/game-icons/${gameType.fullName}_themed.png')`,
                  }}
                ></button>
              </li>
            ))}
          </ul>
        </Authenticated>

        <Unauthenticated>
          <div className="flex items-center justify-center">
            Hey there :) Please
            <span className="mx-1 text-primary">
              <SignInButton />
            </span>
            to be able to create and join games
          </div>
        </Unauthenticated>
      </section>
    </>
  );
}
