import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

const rpsMoves = v.array(v.object({
  playerId: v.string(),
  choice: v.string()
}));
export type RpsMoves = Infer<typeof rpsMoves>;

export default defineSchema({
  room: defineTable({
    name: v.string(),
    password: v.string(),
    creatorId: v.string(),
    players: v.array(v.object({
      userName: v.string(),
      userId: v.string()
    })),
    gameType: v.string(),
    lastActivity: v.number(),
  }),
  rps: defineTable({
    roomId: v.id('room'),
    rounds: v.array(v.object({
      winnerId: v.union(v.string(), v.null())
    })),
    moves: rpsMoves,
  }),
  tictactoe: defineTable({
    roomId: v.id('room'),
    board: v.array(v.string()),
    playerSymbols: v.array(v.object({
      playerId: v.string(),
      symbol: v.string()
    }))
  }),
  chat: defineTable({
    roomId: v.union(v.id("room"), v.null()),
    messages: v.array(
      v.object({
        message: v.string(),
        userName: v.string(),
      })
    ),
  }),
});

