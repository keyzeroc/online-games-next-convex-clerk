import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { decideRpsWinner } from "@/lib/rps";
import { internal } from "./_generated/api";

export const getGameDetails = query({
  args: {
    roomId: v.id('room')
  },
  handler: async (ctx, { roomId }) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) return null;

    const foundRoom = await ctx.db.get(roomId);
    if (!foundRoom || !foundRoom.players.find(pl => pl.userId === user.subject)) return null;

    return await ctx.db.query('rps').filter(q => q.eq(q.field('roomId'), roomId)).first();
  }
})

export const makeAMove = mutation({
  args: {
    roomId: v.id('room'),
    gameId: v.id('rps'),
    choice: v.string()
  },
  handler: async (ctx, { roomId, gameId, choice }) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) return [];

    const foundRoom = await ctx.db.get(roomId);
    if (!foundRoom || !foundRoom.players.find(pl => pl.userId === user.subject)) return [];

    const foundGame = await ctx.db.get(gameId)
    if (!foundGame || foundGame.moves.find(move => move.playerId === user.subject)) return [];

    foundGame.moves = [...foundGame.moves, {
      playerId: user.subject,
      choice
    }];

    let winner = "";
    if (foundGame.moves.length === 2) {
      winner = decideRpsWinner(foundGame.moves);
      return await ctx.db.patch(gameId, {
        moves: foundGame.moves,
        rounds: [...foundGame.rounds, { winnerId: winner === '' ? null : winner }]
      })

    }
    return await ctx.db.patch(gameId, {
      moves: foundGame.moves,
    })
  }
})

export const resetGameState = mutation({
  args: {
    gameId: v.id('rps')
  },
  handler: async (ctx, { gameId }) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) return [];

    await ctx.scheduler.runAfter(3000, internal.rps.resetGameInternal, { gameId })
  }
})

export const resetGameInternal = internalMutation({
  args: {
    gameId: v.id('rps')
  },
  handler: async (ctx, { gameId }) => {
    await ctx.db.patch(gameId, {
      moves: []
    })
  },
});

