"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isPasswordCorrect } from "@/lib/hashing";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { AllDatabaseTypes } from "@/types/types";

type JoinGameDialogProps = {
  room: AllDatabaseTypes["room"];
};

export function JoinGameDialog({ room }: JoinGameDialogProps) {
  const [typedPassword, setTypedPassword] = useState("");
  const joinGameMutation = useMutation(api.room.joinRoom);
  const { isLoaded, user } = useUser();

  const router = useRouter();

  const onJoin = async () => {
    // if it's game creator just redirect to the game
    // const foundGamePlayer = room.players.find((pl) => pl.userId === user?.id);
    // if (foundGamePlayer) {
    //   router.push(`/games/${room.gameType}/${room._id}`);
    //   return;
    // }
    // // if it's player wanting to join a game without a pass - let them join
    // // if (room.password === "" && !foundGamePlayer) {
    // else if (room.password === "") {
    //   await joinGameMutation({ roomId: room._id, password: typedPassword });
    //   router.push(`/games/${room.gameType}/${room._id}`);
    //   return;
    // }
    // // if game is password protected check if pass correct
    // else if (room.password !== "" && typedPassword.trim() !== "") {
    //   const isPassCorrect = await isPasswordCorrect(
    //     typedPassword,
    //     room.password,
    //   );
    //   if (!isPassCorrect) return;

    //   await joinGameMutation({ roomId: room._id, password: typedPassword });
    //   router.push(`/games/${room.gameType}/${room._id}`);
    //   return;
    // }
    let canJoin = false;
    // to reduce DB request, perform some checks here
    const foundGamePlayer = room?.players?.find(
      (pl) => pl?.userId === user?.id,
    );
    // if player is already in game
    if (foundGamePlayer) {
      canJoin = true;
    }
    // if room has no space
    else if (room?.players?.length >= 2) {
      return;
    } else if (room?.players?.length < 2) {
      if (
        room?.password !== "" &&
        !(await isPasswordCorrect(typedPassword, room?.password))
      )
        return;
      canJoin = await joinGameMutation({
        roomId: room._id,
        password: typedPassword,
      });
    }

    if (canJoin) {
      router.push(`/games/${room?.gameType}/${room?._id}`);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={isLoaded && !user}>
          {isLoaded && user ? "Join game" : "Sign in to join"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join game</DialogTitle>
        </DialogHeader>
        {isLoaded &&
          room.password !== "" &&
          !room?.players.find((pl) => pl.userId === user?.id) && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Password
                </Label>
                <Input
                  type="password"
                  autoComplete="off"
                  id="name"
                  className="col-span-3"
                  onChangeCapture={(e) =>
                    setTypedPassword(e.currentTarget.value)
                  }
                />
              </div>
            </div>
          )}
        <DialogFooter className="flex items-center">
          <DialogDescription className="mr-auto">
            Your are trying to join - {room.name}
          </DialogDescription>
          <Button onClick={onJoin} type="submit">
            Join!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
