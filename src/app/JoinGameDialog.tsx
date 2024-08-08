"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isPasswordCorrect } from "@/lib/hashing";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useSession } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { AllDatabaseTypes } from "@/types/types";

type JoinGameDialogProps = {
  room: AllDatabaseTypes["room"];
};

export function JoinGameDialog({ room }: JoinGameDialogProps) {
  const [typedPassword, setTypedPassword] = useState("");
  const joinGameMutation = useMutation(api.room.joinRoom);
  const { session } = useSession();

  const router = useRouter();

  const onJoin = async () => {
    // if it's game creator just redirect to the game
    if (room.players.find((pl) => pl.userId === session?.user.id!)) {
      router.push(`/games/${room.gameType}/${room._id}`);
      return;
    }
    // if it's player wanting to join a game without a pass - let them join
    if (
      room.password === "" &&
      !room.players.find((pl) => pl.userId === session?.user.id)
    ) {
      await joinGameMutation({ roomId: room._id, password: typedPassword });
      router.push(`/games/${room.gameType}/${room._id}`);
      return;
    }
    // if game is password protected check if pass correct
    if (room.password !== "" && typedPassword.trim() !== "") {
      const isPassCorrect = await isPasswordCorrect(
        typedPassword,
        room.password,
      );
      if (!isPassCorrect) return;

      await joinGameMutation({ roomId: room._id, password: typedPassword });
      router.push(`/games/${room.gameType}/${room._id}`);
      return;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={!session}>
          {session ? "Join game" : "Sign in to join"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join game</DialogTitle>
          <DialogDescription>
            Your are trying to join{" "}
            <span className="underline">{room.name}</span>
          </DialogDescription>
        </DialogHeader>

        {room.password !== "" && room.creatorId !== session?.user.id && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Password
              </Label>
              <Input
                id="name"
                className="col-span-3"
                onChangeCapture={(e) => setTypedPassword(e.currentTarget.value)}
              />
            </div>
          </div>
        )}
        <DialogFooter>
          <Button onClick={onJoin} type="submit">
            Join!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
