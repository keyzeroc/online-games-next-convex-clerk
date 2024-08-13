"use client";

import React, { useRef, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { MessageSquare } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { Id } from "../../../convex/_generated/dataModel";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/nextjs";

type ChatProps = {
  roomId?: Id<"room">;
};

export default function Chat({ roomId }: ChatProps) {
  const chat = useQuery(api.chat.getChatMessages, { roomId: roomId });
  const inputRef = useRef<HTMLInputElement>(null);
  const sendMessageMutation = useMutation(api.chat.sendMessage);
  const { isLoaded, user } = useUser();

  const onSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const typedMessage = inputRef?.current?.value;

    if (!typedMessage || typedMessage.trim() === "") return;
    await sendMessageMutation({ roomId, message: typedMessage });
  };

  return (
    <Sheet>
      <SheetTrigger className="fixed bottom-8 right-8 z-20 rounded-full bg-primary p-4">
        <MessageSquare stroke="#fff" />
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-2">
        <SheetHeader>
          <SheetTitle className="text-center">
            {!roomId ? "Main" : "Game"} room chat
          </SheetTitle>
        </SheetHeader>
        {chat && (
          <ul>
            {chat?.messages.map((message, index) => (
              <li key={"msg:" + index} className="py-1">
                <span>
                  <span className="font-bold">{message.userName+": "}</span>{message.message}
                </span>
                {/* <span>{message.message}</span> */}
              </li>
            ))}
          </ul>
        )}
        {!chat && <p>No messages yet!</p>}

        <form className="mt-auto flex items-end gap-2" onSubmit={onSendMessage}>
          <Input
            ref={inputRef}
            autoComplete="off"
            disabled={isLoaded && !user}
            name="message"
          />
          <Button disabled={isLoaded && !user} type="submit">
            {isLoaded && user ? "Send" : "Not signed in"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
