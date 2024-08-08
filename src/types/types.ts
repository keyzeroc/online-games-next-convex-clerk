import { Doc } from "../../convex/_generated/dataModel";

export type AllDatabaseTypes = {
  chat: Doc<"chat">,
  room: Doc<"room">,
  games: Doc<"tictactoe">,
  rps: Doc<"rps">
  // Add more tables as needed
};