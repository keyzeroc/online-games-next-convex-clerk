"use client";

import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

type CreateGameFormProps = {
  gameType: string;
};

export default function CreateGameForm({ gameType }: CreateGameFormProps) {
  const createGameMutation = useMutation(api.room.createRoom);
  const router = useRouter();

  const createGameHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElement = e.currentTarget as HTMLFormElement;
    const formData = new FormData(formElement);
    const name = formData.get("name") as string;
    const password = formData.get("password") as string;
    if (name?.trim() === "") return;

    const gameId = await createGameMutation({
      name,
      password,
      gameType,
    });
    router.push(`/games/${gameType}/${gameId}`);
  };

  return (
    <form onSubmit={createGameHandler} className="flex flex-col gap-4">
      <Input
        autoComplete="off"
        name="name"
        type="text"
        placeholder="Please set room name"
      />
      <Input
        autoComplete="off"
        name="password"
        type="text"
        placeholder="Set room password or leave empty"
      />
      <Button type="submit">Create game</Button>
    </form>
  );
}
