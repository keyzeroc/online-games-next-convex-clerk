import { Doc } from "../../convex/_generated/dataModel";

export type AllDatabaseTypes = {
  room: Doc<"room">,
  chat: Doc<"chat">,
  tictactoe: Doc<"tictactoe">,
  rps: Doc<"rps">
  battleships: Doc<'battleships'>
  // Add more tables as needed
};