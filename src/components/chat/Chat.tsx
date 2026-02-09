"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
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
  const [isChatOpened, setIsChatOpened] = useState(false);
  const { isLoaded, user } = useUser();

  const onSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const typedMessage = inputRef?.current?.value;

    if (!typedMessage || typedMessage.trim() === "") return;
    await sendMessageMutation({ roomId, message: typedMessage });
    inputRef.current.value = "";
  };

  const scrollViewToLastMessage = async (ms: number) => {
    await new Promise((resolve) => setTimeout(resolve, ms));
    inputRef?.current?.scrollIntoView();
  };
  
  useLayoutEffect(() => {
    (async () => {
      await scrollViewToLastMessage(100);
    })();
  }, [chat?.messages,isChatOpened]);

  return (
    <Sheet onOpenChange={(isOpen) => setIsChatOpened(isOpen)}>
      <SheetTrigger className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-20 rounded-full bg-primary p-3 md:p-4 shadow-lg hover:shadow-xl transition-shadow">
        <MessageSquare className="h-5 w-5 md:h-6 md:w-6" stroke="#fff" />
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-2 overflow-y-scroll w-[85vw] sm:w-full">
        <SheetHeader>
          <SheetTitle className="text-center text-base sm:text-lg">
            {!roomId ? "Main" : "Game"} room chat
          </SheetTitle>
        </SheetHeader>
        {chat && (
          <ul>
            {chat?.messages.map((message, index) => (
              <li key={"msg:" + index} className="message py-1">
                <span id="last" className="text-sm sm:text-base">
                  <span className="font-bold">{message.userName + ": "}</span>
                  {message.message}
                </span>
              </li>
            ))}
          </ul>
        )}
        {!chat && <p className="text-sm sm:text-base">No messages yet!</p>}

        <form className="mt-auto flex items-end gap-2" onSubmit={onSendMessage}>
          <Input
            className="border-2 text-sm sm:text-base"
            ref={inputRef}
            autoComplete="off"
            disabled={isLoaded && !user}
            name="message"
          />
          <Button className="text-sm sm:text-base" disabled={isLoaded && !user} type="submit">
            {isLoaded && user ? "Send" : "Not signed in"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
