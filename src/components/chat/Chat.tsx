"use client";
import React, { useState } from "react";
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

type ChatProps = {
  roomId?: Id<"room">;
};

export default function Chat({ roomId }: ChatProps) {
  const chat = useQuery(api.chat.getChatMessages, { roomId: roomId });
  const [typedMessage, setTypedMessage] = useState("");
  const sendMessageMutation = useMutation(api.chat.sendMessage);

  const onSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!typedMessage || typedMessage.trim() === "") return;
    await sendMessageMutation({ roomId, message: typedMessage });
    setTypedMessage("");
  };

  return (
    <Sheet>
      <SheetTrigger className="fixed bottom-8 right-8 rounded-full bg-primary p-4">
        <MessageSquare />
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
              <li key={"msg:" + index} className="flex gap-2 p-2">
                <span>{message.userName + ":"}</span>
                <span>{message.message}</span>
              </li>
            ))}
          </ul>
        )}
        {!chat && <p>No messages yet!</p>}

        <form className="mt-auto flex items-end gap-2" onSubmit={onSendMessage}>
          <Input
            value={typedMessage}
            name="message"
            onChangeCapture={(e) => setTypedMessage(e.currentTarget.value)}
          />
          <Button type="submit">Send</Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
